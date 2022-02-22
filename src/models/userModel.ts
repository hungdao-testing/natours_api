import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';


interface IUserDocument extends Document {
    name: string;
    email: string;
    photo?: string;
    password: string;
    passwordConfirm: string | undefined;
}

export interface IUser extends IUserDocument {
    correctPassword: (password1: string, password2: string) => Promise<boolean>
}

interface IUserModel extends Model<IUserDocument, {}> { }

const userSchema = new Schema<IUser, IUserModel>({
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
        minlength: [8, 'The min length is at least 8 chars'],
        select: false // means doesn't show in the API response
    },
    passwordConfirm: {
        type: String, required: [true, 'Please provide password'], validate: {
            //THIS only works on save
            validator: function (this: IUserDocument, el: string) {
                return el === this.password;
            },
            message: "Password are not the same as"
        }
    }
});

userSchema.pre('save', async function (this: IUserDocument, next) {
    // Only run this function if password is actually modified
    if (!this.isModified('password')) next();

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm
    this.passwordConfirm = undefined;

});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {

    return await bcrypt.compare(candidatePassword, userPassword);
}

export const UserModel = mongoose.model<IUser>('User', userSchema);


