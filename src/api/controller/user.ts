import User, { IUser } from '../../db/models/User';
import Message, { IMessage } from '../../db/models/Message';
import { DEFAULT_MESSAGE_ERROR, DEFAULT_MESSAGE_ERROR_NO_USER, isValidMongooseId } from './../constants';

export default () => ({
  index: async (req: any, res: any) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json(DEFAULT_MESSAGE_ERROR);
    }
  },

  getUser: async (req: any, res: any) => {
    const { id } = req.params;
    try {
      let user: IUser | null;
      if (isValidMongooseId(id)) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ id });
      }
      if (!user) {
        res.status(400).json(DEFAULT_MESSAGE_ERROR_NO_USER);
      } else {
        res.status(200).json(user);
      }
    } catch (e) {
      res.status(500).json(DEFAULT_MESSAGE_ERROR);
    }
  },

  getUserMessages: async (req: any, res: any) => {
    const { id } = req.params;
    let { populate } = req.query;
    populate = Boolean(JSON.parse(populate));

    try {
      let messages: IMessage[] | null = null;
      if (isValidMongooseId(id)) {
        if (!populate) {
          messages = await Message.find({ from: id });
        } else {
          messages = await Message.find({ from: id }).populate('from');
        }
      } else {
        const user = await User.findOne({ id: id });

        if (user) {
          if (!populate) {
            messages = await Message.find({ from: user._id });
          } else {
            messages = await Message.find({ from: user._id }).populate('from');
          }
        } else {
          res.status(400).json(DEFAULT_MESSAGE_ERROR_NO_USER);
        }
      }
      if (!messages) {
        res.status(400).json({
          error: 'Messages were not found',
        });
      } else {
        res.status(200).json(messages);
      }
    } catch (e) {
      res.status(500).json(DEFAULT_MESSAGE_ERROR);
    }
  },
});
