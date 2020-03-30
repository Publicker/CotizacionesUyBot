import { Document, model, Schema } from 'mongoose';

// Schema
const UserSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  is_bot: {
    type: Boolean,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  language_code: {
    type: String,
  },
  notification: {
    type: Boolean,
    default: false,
  },
});

// DO NOT export this
export interface IUser extends Document {
  id: string;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  notification: boolean;
}

// Default export
export default model<IUser>('User', UserSchema);
