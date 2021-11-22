import { Router } from "express";
import { join, login } from '../controller/userController';
import { trending } from "../controller/videoController";

const globalRouter = Router();

globalRouter.get('/', trending);
globalRouter.get('/join', join);
globalRouter.get('/login', login);

export default globalRouter;