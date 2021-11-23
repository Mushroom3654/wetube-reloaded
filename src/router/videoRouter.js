import { Router } from "express";
import {
    watch,
    getEdit,
    getUpload,
    postEdit,
    postUpload,
    remove
} from "../controller/videoController";

const videoRouter = Router();

videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit);
videoRouter.route('/:id([0-9a-f]{24})/delete').get(remove);
videoRouter.route('/upload').get(getUpload).post(postUpload);

export default videoRouter;