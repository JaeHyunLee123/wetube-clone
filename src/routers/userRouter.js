import express from "express";
import {
  getEdit,
  postEdit,
  deleteAccount,
  getProfile,
  logout,
  startGithubLogin,
  callbackGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";

import {
  protectorMiddleware,
  publicOnlyMiddleWare,
  uploadAvatar,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadAvatar.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/delete", deleteAccount);
userRouter.get("/github/start", publicOnlyMiddleWare, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleWare, callbackGithubLogin);
userRouter.get("/:id", getProfile);

export default userRouter;
