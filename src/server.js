import express from 'express';
import morgan from 'morgan';
import globalRouter from "./router/globalRouter";
import userRouter from "./router/userRouter";
import videoRouter from "./router/videoRouter";

const PORT = 4000;

const app = express();
// Morgan - Global Middleware
const logger = morgan('common') // dev | combined | common | short | tiny
app.use(logger);

app.use('/', globalRouter);
app.use('/user', userRouter);
app.use('/video', videoRouter);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
