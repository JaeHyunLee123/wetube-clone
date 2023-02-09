import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import session from "express-session";

export const getJoin = (req, res) => {
  return res.render("user/join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;

  if (password !== password2) {
    return res.status(400).render("user/join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match",
    });
  }

  const userNameExists = await User.exists({ username });
  if (userNameExists) {
    return res.status(400).render("user/join", {
      pageTitle: "Join",
      errorMessage: "This username is already taken",
    });
  }

  const userEmailExists = await User.exists({ email });
  if (userEmailExists) {
    return res.status(400).render("user/join", {
      pageTitle: "Join",
      errorMessage: "This email is already taken",
    });
  }

  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("user/join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("user/login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("user/login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exist.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("user/login", {
      pageTitle: "Login",
      errorMessage: "Wrong password",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    //camel case를 사용하지 않고 snake case를 사용한 이유는 깃허브가 설정한 파라미터 그대로 적어야하기 때문
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false, //github 아이디가 있는 경우에만 로그인 허용
    scope: "read:user user:email", //github에 요구하는 정보 -> 유저 프로필과 유저 이메일
  };
  const params = new URLSearchParams(config).toString(); //config 객체 정보를 알아서 url 형식으로 바꿔줌
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const callbackGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.verified === true && email.primary === true
    );
    if (!emailObj) return res.redirect("login");
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //create user
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        location: userData.location,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
      });
    } else {
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("user/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      //세션으로부터 user id를 받아온다
      user: { _id, avatarUrl },
    },
    //폼에 있는 정보들도 받아온다
    body: { name, email, username, location },
    file,
  } = req;

  //중복 있으면 돌려보내
  if (req.session.user.username !== username) {
    const userNameExists = await User.exists({ username });
    if (userNameExists) {
      return res.status(400).render("user/edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This username is already taken",
      });
    }
  }
  if (req.session.user.email !== email) {
    const userEmailExists = await User.exists({ email });
    if (userEmailExists) {
      return res.status(400).render("user/edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This email is already taken",
      });
    }
  }

  //받아온 user id와 정보들로 DB 업데이트하고
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
      avatarUrl: file ? file.path : avatarUrl,
    },
    //업데이트된 정보를 리턴하라는 옵션, default는 false
    { new: true }
  );

  //세션도 업데이트
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) {
    return redirect("/");
  }
  return res.render("user/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      //세션으로부터 user id를 받아온다
      user: { _id },
    },
    //폼에 있는 정보들도 받아온다
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const user = await User.findById(_id);
  //기존의 패스워드가 일치하는지 확인한다
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password incorrect",
    });
  }
  //비밀번호 2개가 일치하는지 확인한다
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "New password confirmation does not match",
    });
  }

  //위 조건들 다 통과하면 비밀번호 바꿔줘
  user.password = newPassword;
  await user.save(); //save를 해줘야 비밀번호 해싱해주는 미들웨어 작동함

  //비밀번호 바꾸면 유저 로그아웃 시켜서 다시 로그인하게 만들자
  return res.redirect("/users/logout");
};

export const deleteAccount = (req, res) => res.send("delete user");
export const seeProfile = (req, res) => res.send("Profile");
