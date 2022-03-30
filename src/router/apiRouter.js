import { Router } from "express";
import { registerView } from "../controller/videoController";

const apiRouter = Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;