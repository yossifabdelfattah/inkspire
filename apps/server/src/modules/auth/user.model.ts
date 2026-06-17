import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from './user.types';

export interface IUser extends Document {
  name: string;
  email: string;
  firebaseUid?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
export default User;
