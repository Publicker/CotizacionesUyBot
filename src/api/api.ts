import express from 'express';
import { ObjectID } from 'mongodb';
import User, { IUser } from '../db/models/User';
import Message, { IMessage } from '../db/models/Message';
import Cotization, { ICotization } from '../db/models/Cotization';
// import { ECurrencies } from '../cotization/CurrencyModel';

const app = express();

const DEFAULT_MESSAGE_ERROR = {
  error: 'Internal server error',
};

const DEFAULT_MESSAGE_BAD_REQUEST = {
  error: 'Bad request',
};

const DEFAULT_MESSAGE_ERROR_NO_USER = {
  error: 'User with the id provided was not found',
};

function isValidMongooseId(id: string) {
  return ObjectID.isValid(id) && id.length > 9;
}

app.get('/', (req, res) => {
  res.send(200).json({ message: 'OK' });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(DEFAULT_MESSAGE_ERROR);
  }
});

app.get('/api/users/:id', async (req, res) => {
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
});

app.get('/api/users/:id/messages', async (req, res) => {
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
});

//       Object.keys(ECurrencies).forEach(async (keyValue, index) => {
//         if (keyValue == key) {
//           const value = Object.values(ECurrencies)[index];
//           const cotizations = await Cotization.find({ currency: value });
//           res.status(200).json(cotizations);
//         }
//       });

app.get('/api/cotization/', async (req, res) => {
  const date: Date = new Date(req.query.date);
  const wantHour = Boolean(req.query.wantHour);
  const wantWeek = Boolean(req.query.wantWeek);
  const wantMonth = Boolean(req.query.wantMonth);

  if (Boolean(date.getTime())) {
    let minDate: Date = new Date(date);
    let maxDate: Date = new Date(date);

    if (wantHour) {
      minDate.setMinutes(0);
      minDate.setSeconds(0);

      maxDate.setMinutes(59);
      maxDate.setSeconds(59);
    } else if (wantWeek) {
      let day = minDate.getDay();

      minDate.setDate(minDate.getDate() - day + (day === 0 ? -6 : 1)); // Set when is Monday

      maxDate.setDate(minDate.getDate() + 6); // Set when is Sunday

      minDate.setSeconds(0);
      maxDate.setSeconds(59);

      minDate.setMinutes(0);
      maxDate.setMinutes(59);

      minDate.setHours(0);
      maxDate.setHours(23);
    } else if (wantMonth) {
      minDate.setSeconds(0);
      maxDate.setSeconds(59);

      minDate.setMinutes(0);
      maxDate.setMinutes(59);

      minDate.setHours(0);
      maxDate.setHours(23);

      minDate.setDate(1);

      // Get the last day of month
      let nextMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
      nextMonth.setDate(nextMonth.getDate() - 1);

      // Set the last day
      maxDate.setDate(nextMonth.getDate());
    } else {
      minDate.setSeconds(0);
      maxDate.setSeconds(59);

      minDate.setMinutes(0);
      maxDate.setMinutes(59);

      minDate.setHours(0);
      maxDate.setHours(23);
    }

    const cotizations = await Cotization.find({ time: { $lte: maxDate, $gte: minDate } }).sort({ time: -1 });

    res.status(200).json(cotizations);
  } else {
    // Invalid format of date time: MUST TO BE MM/DD/YYYY HH:MM:SS
    try {
      const cotizations = await Cotization.find();
      res.status(200).json(cotizations);
    } catch (e) {
      res.send(500).json(DEFAULT_MESSAGE_ERROR);
    }
  }
});

export { app };
