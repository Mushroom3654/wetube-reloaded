import { Router } from "express";
import {
    getEdit,
    postEdit,
    remove,
    logout,
    watch,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword,
} from "../controller/userController";
import {protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = Router();

userRouter.route('/edit')
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single('avatar'), postEdit);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.route('/change-password')
    .all(protectorMiddleware).get(getChangePassword).post(postChangePassword)
userRouter.get('/:id', watch);
userRouter.get('/remove', remove);

export default userRouter;