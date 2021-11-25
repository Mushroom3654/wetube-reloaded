import mongoose, {mongo} from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/wetube");


const connection = mongoose.connection;

const handleOpen = () => console.log('Connected to DB');
const handleError = (error) => console.log('DB Error =>', connection);

connection.on('error', handleError);
connection.once('open', handleOpen);
