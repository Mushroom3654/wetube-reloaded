import { Router } from "express";
import { getJoin, postJoin, getLogin, postLogin } from '../controller/userController';
import { trending, search } from "../controller/videoController";

const rootRouter = Router();

rootRouter.get('/', trending);
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.route('/login').get(getLogin).post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;