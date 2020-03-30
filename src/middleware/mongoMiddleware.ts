import { ContextMessageUpdate } from 'telegraf';
import User, { IUser } from '../db/models/User';
import Message, { IMessage } from '../db/models/Message';
import { User as UserTelegraf, Message as MessageTelegraf } from 'telegraf/typings/telegram-types';

async function checkUser(from?: UserTelegraf): Promise<IUser | null> {
  const user = await User.findOne({ id: from?.id });

  if (!user && from) {
    const newUser: IUser = new User({
      id: from.id.toString(),
      is_bot: from.is_bot,
      first_name: from.first_name,
      last_name: from.last_name,
      username: from.username,
      language_code: from.language_code,
    });
    newUser.save();
  }

  return user;
}

async function saveMessage(message: MessageTelegraf, user: IUser | null) {
  const date = new Date(message.date * 1000);

  const newMessage: IMessage = new Message({
    message_id: message.message_id.toString(),
    from: user?._id,
    date,
    text: message.text,
  });

  newMessage.save();
}

export async function checkUserAndMessage(ctx: ContextMessageUpdate, next: any) {
  if (ctx?.updateType === 'message' && ctx?.update?.message?.text) {
    const { from, text } = ctx.update.message;

    if (from) {
      const user = await checkUser(from);

      saveMessage(ctx.update.message, user);
    }
  }

  return next();
}
