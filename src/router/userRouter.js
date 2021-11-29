import { Router } from "express";
import { edit, remove, logout, see, startGithubLogin } from "../controller/userController";

const userRouter = Router();

userRouter.get('/edit', edit);
userRouter.get('/remove', remove);
userRouter.get('/logout', logout);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/:id', see);

export default userRouter;