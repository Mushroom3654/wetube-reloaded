import { Schema, model } from 'mongoose';
import { hash } from 'bcrypt';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
})

userSchema.pre('save', async function() {
   this.password = await hash(this.password, 'salts');
});

const User = model('User', userSchema);

export default User;