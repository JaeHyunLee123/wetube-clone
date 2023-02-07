import express from "express";
import {
  edit,
  deleteAccount,
  seeProfile,
  logout,
  startGithubLogin,
  callbackGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", deleteAccount);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/callback", callbackGithubLogin);
userRouter.get("/:id", seeProfile);

export default userRouter;
