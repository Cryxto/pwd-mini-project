import { Prisma} from 'prisma/prisma-client'

export type UserProfile = Prisma.UserGetPayload<{
  omit : {
    password : true
  }
  include: {
    UsersCoupon: {
      include: {
        Coupon: true;
      };
    };
    UserPointHistory: true;
  };
}>;
