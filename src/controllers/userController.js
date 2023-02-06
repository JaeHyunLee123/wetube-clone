import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, email, username, password, location } = req.body;
  await User.create({
    name,
    email,
    username,
    password,
    location,
  });
  return res.redirect("/login");
};
export const login = (req, res) => res.send("Login");
export const edit = (req, res) => res.send("Edit user");
export const deleteAccount = (req, res) => res.send("delete user");
export const seeProfile = (req, res) => res.send("Profile");
export const logout = (req, res) => res.send("logout");
