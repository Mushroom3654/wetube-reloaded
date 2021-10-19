import { Router } from "express";

const userRouter = Router();

const handleEditUser = (req, res) => res.send('Edit User');

userRouter.get('/edit', handleEditUser);

export default userRouter;