import mongoose, {mongo} from 'mongoose';

mongoose.connect(process.env.DB_URL);

const connection = mongoose.connection;

const handleOpen = () => console.log('Connected to DB');
const handleError = (error) => console.log('DB Error =>', connection);

connection.on('error', handleError);
connection.once('open', handleOpen);
