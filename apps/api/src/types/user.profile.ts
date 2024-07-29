import { Prisma } from 'prisma/prisma-client';

export type UserProfile = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
  include: {
    UsersCoupon: {
      where: {
        relatedTransactionId : null 
      },
      include: {
        Coupon: true;
      };
    };
    UserPointHistory: true;
    EventTransaction: true;
  };
}>;
