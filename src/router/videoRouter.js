import { Router } from "express";
import {
    watch,
    getEdit,
    getUpload,
    postEdit,
    postUpload,
} from "../controller/videoController";

const videoRouter = Router();


videoRouter.get('/:id(\\d+)', watch);
videoRouter.route('/:id(\\d+)/edit').get(getEdit).post(postEdit);
videoRouter.route('/upload').get(getUpload).post(postUpload);

export default videoRouter;