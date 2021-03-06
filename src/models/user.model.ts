import mongoose, { Schema, Query, MongooseError } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { IUser, IUserDocument, UserRoles } from '@app_type'

const userSchema = new Schema<IUser>({
  name: { type: String, required: [true, 'Please tell us your name'] },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: {
      values: [UserRoles.ADMIN, UserRoles.GUIDE, UserRoles['LEAD-GUIDE'], UserRoles.USER],
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
    default: false,
    select: false,
  },
  confirmationCode: {
    type: String,
    unique: true,
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

userSchema.pre(/^find/, function (this: Query<any, IUser>, next) {
  this.select('-confirmationCode')
  next()
})

userSchema.post(
  'save',
  async function (error: MongooseError & { code?: number }, doc: IUserDocument, next: Function) {
    if (error.name === 'MongoServerError' && error?.code === 11000) {
      next(new Error('There was a duplicate user information'))
    } else {
      next()
    }
  },
)

userSchema.post(
  'update',
  function (error: MongooseError & { code?: number }, doc: IUserDocument, next: Function) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new Error('There was a duplicate user information'))
    } else {
      next() // The `update()` call will still error out.
    }
  },
)

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function (this: IUser, JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000
    return JWTTimestamp < changedTimestamp
  }

  //False means not change
  return false
}

userSchema.methods.createPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString('hex') // generate random bytes and convert to hex

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) //expire on 10 mins;

  return resetToken
}

export const UserModel = mongoose.model<IUser>('User', userSchema)
