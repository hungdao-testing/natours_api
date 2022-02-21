import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    photo?: string;
    password: string;
    passwordConfirm: string | undefined;
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
    passwordConfirm: {
        type: String, required: [true, 'Please provide password'], validate: {
            //THIS only works on save
            validator: function (this: IUser, el: string) {
                return el === this.password;
            },
            message: "Password are not the same as"
        }
    }
});

userSchema.pre('save', async function (this: IUser, next) {
    // Only run this function if password is actually modified
    if (!this.isModified('password')) next();

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm
    this.passwordConfirm = undefined;

})

export const UserModel = mongoose.model<IUser>('User', userSchema);
