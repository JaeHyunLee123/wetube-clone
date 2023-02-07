import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match",
    });
  }

  const userNameExists = await User.exists({ username });
  if (userNameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username is already taken",
    });
  }

  const userEmailExists = await User.exists({ email });
  if (userEmailExists) {
    return res.status(400).render("join", {
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
    return res.status(400).render("/join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exist.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
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
    console.log(userData);

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

export const edit = (req, res) => res.send("Edit user");
export const deleteAccount = (req, res) => res.send("delete user");
export const seeProfile = (req, res) => res.send("Profile");
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
