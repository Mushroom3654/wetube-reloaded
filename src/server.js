import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rootRouter from "./router/rootRouter";
import userRouter from "./router/userRouter";
import videoRouter from "./router/videoRouter";
import apiRouter from "./router/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
// Morgan - Global Middleware
const logger = morgan('dev') // dev | combined | common | short | tiny

// engine을 퍼그로 설정
app.set('view engine', 'pug');
// Views 참조 디렉터리 설정
app.set('views', process.cwd() + '/src/views');
app.use(logger);
// request body parsing
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.COOKIE_SECRET, // 쿠키에 접근할 때 필요한 키값
    resave: false,
    saveUninitialized: false, // 세션이 수정 될때만 저장하도록 하는 옵션
    // cookie: {
    //     maxAge: 20000, // expired duration
    // },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}))

app.use(localsMiddleware);
app.use("/uploads", express.static('uploads'));
app.use("/static", express.static('assets'));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use('/api', apiRouter);

export default app;