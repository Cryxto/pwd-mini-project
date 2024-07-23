import bcrypt from "bcrypt";
import { AuthResultInterface } from "@/interfaces/auth.interface";
import prisma from "@/prisma";
import { SignUpType } from "@/types/auth.type";
import { randomString } from "@/utils/string.utils";

class AuthRepository {
  async createUser(record: SignUpType): Promise<{
    ok: boolean;
    data_created: AuthResultInterface | {};
    error?: any;
  }> {
    try {
      record.password = await bcrypt.hash(record.password, await bcrypt.genSalt())!;
      const additional = {
        referalCode : (await randomString(5)).toUpperCase()
      }
      const newUser = prisma.user.create({
        data: {
          ...record, ...additional
        },
      });
      const [createdUser] = await prisma.$transaction([newUser]);

      const returnData: AuthResultInterface = {
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt!,
        updatedAt: createdUser.updatedAt,
        referalCode: createdUser.referalCode
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