import prisma from '@/prisma';
import crypto from 'crypto';

class EventRepository {
  async allEvent({ category, userId, location, title, content }: { category?: string, userId?: number, location?: string, title?:string, content?: string }): Promise<{
    ok: boolean;
    error?: any;
    data?: object | null;
  }> {
    try {
      const whereClause: any = {
        deletedAt: null,
      };
  
      if (location) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          { location: { contains: location } }
        ];
      }
      if (title) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          { title: { contains: title } }
        ];
      }
      if (content) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          { content: { contains: content } }
        ];
      }
  
      if (category) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          { Category: { name: { contains: category } } },
          { Category: { displayName: { contains: category } } }
        ];
      }
  
      const events = await prisma.event.findMany({
        where: whereClause,
        // orderBy :{
        //   registrationStartedAt : 'asc',
        // },
        include: {
          Organizer: true,
          Category: true,
          EventTransaction: userId !== undefined ? {
            where: { attendeeId: userId }
          } : true
        },
      });
      // console.log(events);
  
      return {
        ok: true,
        data: events,
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }
  
  async singleEvent(slug: string): Promise<{
    ok: boolean;
    error?: any;
    data?: object | null;
  }> {
    try {
      if (!slug || slug === undefined || slug === '') {
        return {
          ok: false,
          error: 'param cannot be empty',
        };
      }
      const event = await prisma.event.findUnique({
        where: {
          slug: slug,
          deletedAt: null,
        },
        include: {
          Organizer: true,
          Category: true,
          EventTransaction: {
            where: {

            }
          }
        },
      });
      return {
        ok: true,
        data: event,
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }
  async makeEventTransaction(data: {
    userId: number;
    usersCouponId?: number | undefined;
    usePoint?: boolean;
    eventId: number;
    paymentDate: Date | string;
  }) {
    try {
      if (isNaN(data.usersCouponId as number)) {
        data.usersCouponId = undefined;
      }
      console.log('data rep');
      console.log(data);
  
      const userTransactionPrep = await prisma.user.findFirst({
        where: {
          id: data.userId,
          deletedAt: null,
        },
        omit: {
          password: true,
        },
        include: {
          UsersCoupon: {
            where: {
              id: data.usersCouponId,
              deletedAt: null,
              relatedTransactionId: null,
            },
            include: {
              Coupon: true,
            },
          },
          UserPointHistory: {
            where: {
              deletedAt: null,
              relatedTransactionId: null,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          EventTransaction: {
            where: {
              eventId: data.eventId,
              attendeeId: data.userId,
            },
          },
        },
      });
  
      if (userTransactionPrep?.EventTransaction.length! > 0) {
        return {
          ok: false,
          error: 'You already enrolled!',
          code: 422,
        };
      }
  
      const eventTransactionPrep = await prisma.event.findFirst({
        where: {
          id: data.eventId,
          deletedAt: null,
        },
      });
  
      if (!eventTransactionPrep || eventTransactionPrep.quota! <= 0) {
        return {
          ok: false,
          error: 'Quota already full',
          code: 422,
        };
      }
  
      if (!userTransactionPrep) {
        return {
          ok: false,
          error: 'User not found',
          code: 404,
        };
      }
  
      const selectedCoupon = userTransactionPrep.UsersCoupon[0]?.Coupon;
      const currentDate = new Date();
      const availablePoints = userTransactionPrep.UserPointHistory.filter(
        (e) => e.expiredAt! > currentDate,
      );
  
      let pointCanBeUsed = 0;
      let pointUsed = 0;
  
      availablePoints.forEach((e) => {
        pointCanBeUsed += Number(e.points!);
      });
  
      let finalPrices = eventTransactionPrep.basePrices;
  
      if (selectedCoupon && selectedCoupon.unit === 'percent') {
        if (selectedCoupon.discount && finalPrices) {
          finalPrices =
            finalPrices - finalPrices * Number(selectedCoupon.discount! / 100);
        }
      }
  
      if (data.usePoint && availablePoints.length > 0) {
        if (pointCanBeUsed > 0) {
          if (pointCanBeUsed < finalPrices!) {
            finalPrices! -= pointCanBeUsed;
            pointUsed = pointCanBeUsed;
          } else {
            pointUsed = finalPrices as number;
            finalPrices = 0;
          }
        }
      }
  
      const fixEventTransaction = await prisma.$transaction(async (pr) => {
        const eventTransaction = await pr.eventTransaction.create({
          data: {
            attendeeId: data.userId,
            finalPrices,
            paidAt: new Date(),
            eventId: data.eventId,
            uniqueCode: crypto.randomBytes(10).toString('hex').toUpperCase(),
          },
        });
  
        if (data.usePoint && pointUsed > 0) {
          await pr.userPointHistory.create({
            data: {
              userId: data.userId,
              points: -pointUsed,
              relatedTransactionId: eventTransaction.id,
            },
          });
        }
  
        if (selectedCoupon) {
          await pr.usersCoupon.update({
            where: {
              id: data.usersCouponId,
            },
            data: {
              relatedTransactionId: eventTransaction.id,
            },
          });
        }
  
        await pr.event.update({
          where: { id: data.eventId },
          data: {
            enrollment:
              eventTransactionPrep.enrollment !== null
                ? eventTransactionPrep.enrollment + 1
                : 1,
            quota: eventTransactionPrep.quota! - 1,
          },
        });
  
        return eventTransaction;
      });
  
      return {
        ok: true,
        data: fixEventTransaction,
        code: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: error,
        code: 500,
      };
    }
  }
  
  
}

export const eventRepository = new EventRepository();
