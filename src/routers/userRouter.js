import express from "express";
import {
  getEdit,
  postEdit,
  deleteAccount,
  seeProfile,
  logout,
  startGithubLogin,
  callbackGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/delete", deleteAccount);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/callback", callbackGithubLogin);
userRouter.get("/:id", seeProfile);

export default userRouter;
