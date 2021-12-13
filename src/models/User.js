import { Schema, model } from 'mongoose';
import { hash } from 'bcrypt';

const userSchema = new Schema({
    avatarUrl: { type: String },
    email: { type: String, required: true, unique: true },
    location: String,
    name: { type: String, required: true },
    password: { type: String },
    socialOnly: { type: Boolean, default: false },
    videos: [
        { type: Schema.Types.ObjectId, ref: 'Video' }
    ]
})

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 5);
    }
});

const User = model('User', userSchema);

export default User;