import express from "express";
import {
  edit,
  deleteAccount,
  seeProfile,
  logout,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", seeProfile);
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", deleteAccount);

export default userRouter;
