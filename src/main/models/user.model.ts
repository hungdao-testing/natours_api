import mongoose, { Document, Model, Schema } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { UserRoles } from '../../typing/app.type'
import crypto from 'crypto'

interface IUserDocument extends Document {
  name: string
  email: string
  photo?: string
  password: string
  passwordConfirm: string | undefined
  passwordChangedAt: Date
  role: string
  passwordResetToken: string | undefined
  passwordResetExpires: Date | undefined
  active: boolean
}

export interface IUser extends IUserDocument {
  correctPassword: (password1: string, password2: string) => Promise<boolean>
  changePasswordAfter: (JWTTimestamp: string) => boolean
  createPasswordResetToken: () => string
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: [true, 'Please tell us your name'] },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: { type: String },
  role: {
    type: String,
    enum: {
      values: [
        UserRoles.ADMIN,
        UserRoles.GUIDE,
        UserRoles.LEAD_GUIDE,
        UserRoles.USER,
      ],
      message: 'The input role is not matched to supported list',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'The min length is at least 8 chars'],
    select: false, // means doesn't show in the API response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide password'],
    validate: {
      //THIS only works on save
      validator: function (this: IUserDocument, el: string) {
        return el === this.password
      },
      message: 'Password are not the same as',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

userSchema.pre('save', async function (this: IUserDocument, next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) next()

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm
  this.passwordConfirm = undefined
})

userSchema.pre('save', async function (this: IUserDocument, next: Function) {
  // Only run this function if password is actually modified
  if (!this.isModified('password') || this.isNew) next()

  this.passwordChangedAt = new Date(Date.now() - 1000)
  next()
})

userSchema.pre(/^find/, { query: true }, function (next: Function) {
  //this point to current query
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function (
  this: IUser,
  JWTTimestamp: number,
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000
    console.log(JWTTimestamp, changedTimestamp)
    return JWTTimestamp < changedTimestamp
  }

  //False means not change
  return false
}

userSchema.methods.createPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString('hex') // generate random bytes and convert to hex

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) //expire on 10 mins;

  return resetToken
}

export const UserModel = mongoose.model<IUser>('User', userSchema)
