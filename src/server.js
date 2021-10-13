import express from 'express';
import morgan from 'morgan';

const PORT = 4000;

const app = express();
// Morgan - Global Middleware
const logger = morgan('common') // dev | combined | common | short | tiny

const handleHome = (req, res) => {
    return res.send("Hello");
};

const handleLogin = (req, res) => {
    return res.send('Login Here');
};

app.use(logger);
app.get("/", handleHome);
app.get('/login', handleLogin);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
