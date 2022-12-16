const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const generateRandomSubject = (base: string, length = 10) => {
  let subject = base;
  for (let i = 0; i < length; i++) {
    subject += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return subject;
};
