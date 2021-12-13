import { Router } from "express";
import { getJoin, postJoin, getLogin, postLogin } from '../controller/userController';
import { trending, search } from "../controller/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = Router();

rootRouter.get('/', trending);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route('/login').all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;