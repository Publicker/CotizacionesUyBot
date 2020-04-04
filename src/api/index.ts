import express from 'express';
import cotizationController from './controller/cotization';
import userController from './controller/user';

const app = express();

const Cotization = cotizationController();
const User = userController();

app.get('/', (req, res) => {
  res.send(200).json({ message: 'OK' });
});

app.get('/api/users', User.index);

app.get('/api/users/:id',User.getUser);

app.get('/api/users/:id/messages', User.getUserMessages);

app.get('/api/cotization/', Cotization.index);

export { app };
