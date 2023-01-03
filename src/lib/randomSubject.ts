import { INTERNAL_BASE_ID } from './constants';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomSubject = (length = 10) => {
  return `${INTERNAL_BASE_ID}${generateRandomString(length)}`;
};

export const generateRandomString = (length = 10) => {
  let string = '';
  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string;
};
