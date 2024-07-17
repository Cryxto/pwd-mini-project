import bcrypt from "bcrypt";
import { AuthResultInterface } from "@/interfaces/auth.interface";
import prisma from "@/prisma";
import { UserType } from "@/types/auth.type";

class AuthRepository {
  async createUser(record: UserType): Promise<{
    ok: boolean;
    data_created: AuthResultInterface | {};
    error?: any;
  }> {
    try {
      record.password = await bcrypt.hash(record.password, await bcrypt.genSalt())!;
      const newUser = prisma.user.create({
        data: {
          ...record,
        },
      });
      const [createdUser] = await prisma.$transaction([newUser]);

      const returnData: AuthResultInterface = {
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt!,
        updatedAt: createdUser.updatedAt,
      };

      return {
        ok: true,
        data_created: returnData,
      };
    } catch (error) {
      return {
        ok: false,
        data_created: {},
        error: error,
      };
    }
  }
}

export const authRepository = new AuthRepository()