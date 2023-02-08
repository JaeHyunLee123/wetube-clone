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

import { protectorMiddleware, publicOnlyMiddleWare } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/delete", deleteAccount);
userRouter.get("/github/start", publicOnlyMiddleWare, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleWare, callbackGithubLogin);
userRouter.get("/:id", seeProfile);

export default userRouter;
