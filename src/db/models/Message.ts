import { Document, model, Schema } from 'mongoose';
import { IUser } from './User';

// Schema
const MessageSchema = new Schema({
  message_id: {
    type: Number,
    required: true,
    unique: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
  },
  text: {
    type: String,
  },
});

// DO NOT export this
export interface IMessage extends Document {
  message_id: string;
  from?: string;
  date?: Date;
  text?: string;
}

// Default export
export default model<IMessage>('Message', MessageSchema);
