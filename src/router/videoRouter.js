import { Router } from "express";
import {
    watch,
    getEdit,
    getUpload,
    postEdit,
    postUpload,
    remove
} from "../controller/videoController";
import {protectorMiddleware, videoUpload} from "../middlewares";

const videoRouter = Router();

videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter.route('/:id([0-9a-f]{24})/edit')
    .all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route('/:id([0-9a-f]{24})/delete')
    .all(protectorMiddleware).get(remove);
videoRouter.route('/upload')
    .all(protectorMiddleware)
    .get(getUpload)
    .post(videoUpload.single("video"), postUpload);

export default videoRouter;