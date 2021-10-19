import { Router } from "express";

const videoRouter = Router();

const handleWatchVideo = (req, res) => res.send('Watch Video');

videoRouter.get('/watch', handleWatchVideo);

export default videoRouter;