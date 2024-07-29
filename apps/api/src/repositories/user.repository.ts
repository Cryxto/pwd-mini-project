import prisma from '@/prisma';
import { UserProfile } from '@/types/user.profile';


interface ResponseInterface<T> {
  ok: boolean;
  data?: T | null;
  error?: any | null | string;
}

class UserRepository {
  async getProfile(id: number): Promise<ResponseInterface<UserProfile>> {
    let res: ResponseInterface<UserProfile> = {
      ok: false,
      data: null,
    };

    try {
      // const check = prisma.organization.findFirst()
      const data = await prisma.user.findUnique({
        where: {
          id: id,
        },
        omit : {
          password: true
        },
        include: {
          UsersCoupon: {
            where: {
              relatedTransactionId : null 
            },
            include: {
              Coupon: true,
            },
          },
          UserPointHistory: true,
          EventTransaction: true,
          Organization: true
        },
      });

      if (!data) {
        res.error = 'Not found';
        res.ok = false;
        return res;
      }

      res.data = data;
      res.ok = true;
    } catch (error) {
      res.error = error;
      res.ok = false;
    }

    return res;
  }
}

export const userRepository = new UserRepository();
