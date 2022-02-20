import mongoose from 'mongoose';
import validator from 'validator';


export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    photo?: string;
    password: string;
    passwordConfirm: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: [true, 'Please tell us your name'] },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email']
    },
    photo: { type: String },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [8, 'The min length is at least 8 chars']
    },
    passwordConfirm: { type: String, required: [true, 'Please provide password'] }
});


export const UserModel = mongoose.model<IUser>('User', userSchema);
