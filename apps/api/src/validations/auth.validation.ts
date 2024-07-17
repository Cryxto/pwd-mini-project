import prisma from "@/prisma";
import { object, string } from "yup";

const isUniqueEmail = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  return !existingUser;
};

export let AuthSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  username: string().required(),
  email: string()
    .email()
    .required()
    .test("unique-email", "Email already in use.", async (value) => {
      if (value) {
        return await isUniqueEmail(value);
      }
      return false;
    }),
  password: string().required(),
  middleName: string().optional(),
});