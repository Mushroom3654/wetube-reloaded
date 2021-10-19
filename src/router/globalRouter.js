import { Router } from "express";

const globalRouter = Router();

const handleHome = (req, res) => res.send('Home');

globalRouter.get('/', handleHome);

export default globalRouter;