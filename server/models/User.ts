import mongoose, { Schema, Model, Document, HookNextFunction } from 'mongoose';
import crypto from 'crypto';
import uniqueValidator from 'mongoose-unique-validator';
import { inputError } from '../../utils/validations/functions/helpers';
import withVirtualId from './withVirtualId';


// * types -----------------------------------
interface IUserSchema extends Document {
  id: string;
  email: string;
  username: string;
  salt?: string;
  password: string;
  tokenVersion: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
// virtuals and methods
interface IUserBase extends IUserSchema {
  readonly encryptPassword: (password: string) => string;
  readonly checkPassword: (password: string) => boolean;
}
// unpopulated fields
export interface IUser extends IUserBase {
  findOne(findOne: any): any;
  // company: ICompany["_id"];
}
// populated fields
export interface IUser_populated extends IUserBase {
  // company: ICompany;
}
// Static methods
export interface IUserModel extends Model<IUser> {

}
// ------------------------------------------------

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'The email is required'],
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'The username is required'],
    trim: true,
  },
  salt: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 18,
    min: 18,
    max: 80,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// methods
UserSchema.methods.encryptPassword = function(password: string) {
  return crypto.createHmac('sha512', this.salt).update(password).digest('hex');
};

UserSchema.methods.checkPassword = function(password: string) {
  return this.encryptPassword(password) === this.password;
};

// hooks
UserSchema.pre<IUser>('save', function(next) {
  this.salt = crypto.randomBytes(68).toString('hex');
  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.post('save', function(error: any, _doc: IUser, next: HookNextFunction) {
  const errors =  {
    ...(error.errors.email ? { email: [error.errors.email.message] } : {}),
    ...(error.errors.username ? { username: [error.errors.username.message] } : {})
  };
  return next(
    error.errors.email || error.errors.username
      ? inputError(errors)
      : error
  );
});

UserSchema.plugin(uniqueValidator, { message: 'Two users cannot share the same {PATH} ({VALUE})' });

withVirtualId(UserSchema);

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
export type User = typeof User;
