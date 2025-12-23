import { Schema, model, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { name: string; token: string }[];
  generateAuthToken(): Promise<string>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  tokens: {
    type: [{ name: String, token: String }],
    required: true,
    default: [],
  },
});

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      password: this.password,
    },
    process.env.AUTH_TOKEN_SECRET_KEY || 'default_secret_key'
  );

  const index = this.tokens.findIndex((token: { name: string; token: string }) => token.name === 'auth_token');

  if (index === -1) {
    this.tokens = this.tokens.concat({ name: 'auth_token', token });
  }

  return token;
};

const User = model<IUser>('User', userSchema);
export default User;
