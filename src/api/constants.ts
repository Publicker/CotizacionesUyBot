import { ObjectID } from 'mongodb';

export const DEFAULT_MESSAGE_ERROR = {
  error: 'Internal server error',
};

export const DEFAULT_MESSAGE_ERROR_NO_USER = {
  error: 'User with the id provided was not found',
};

export const DEFAULT_MESSAGE_BAD_REQUEST = {
  error: 'Bad request',
};

export function isValidMongooseId(id: string) {
  return ObjectID.isValid(id) && id.length > 9;
}
