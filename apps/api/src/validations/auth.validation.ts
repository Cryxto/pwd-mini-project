import prisma from '@/prisma';
import { object, string } from 'yup';
import bcrypt from 'bcrypt';

const isUniqueEmail = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  return !existingUser;
};

const getUserByIdentifier = async (identifier: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
      deletedAt: null,
    },
  });
};

const isPasswordValid = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export let SignUpSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  username: string().required().test('user-exist', 'User exist', async (value) => {
    if (value) {
      const user = await getUserByIdentifier(value);
      return !user; // Return true if user does not exist, false if user exists
    }
    return false;
  }),
  email: string()
    .email()
    .required()
    .test('unique-email', 'Email already in use.', async (value) => {
      if (value) {
        return await isUniqueEmail(value);
      }
      return false;
    }),
  password: string().required(),
  middleName: string().optional(),
});

export let SignInSchema = object({
  identifier: string() // identifier can be email or username
    .required()
    .test('user-exist', 'User does not exist', async (value) => {
      if (value) {
        const user = await getUserByIdentifier(value);
        return !!user;
      }
      return false;
    }),
  password: string()
    .required()
    .test('password-match', 'Password is wrong!', async (value, context) => {
      const { identifier } = context.parent;
      if (value && identifier) {
        const user = await getUserByIdentifier(identifier);
        if (user) {
          return await isPasswordValid(value, user.password);
        }
      }
      return false;
    }),
});
