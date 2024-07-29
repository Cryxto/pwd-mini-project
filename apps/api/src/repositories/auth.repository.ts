import bcrypt from 'bcrypt';
import { AuthResultInterface } from '@/interfaces/auth.interface';
import prisma from '@/prisma';
import { SignUpType } from '@/types/auth.type';
import { randomString } from '@/utils/string.utils';
import { setDateNowAndAddMonth } from '@/utils/date.utils';

class AuthRepository {
  async createUser(record: SignUpType): Promise<{
    ok: boolean;
    data_created: AuthResultInterface | {};
    error?: any;
  }> {
    try {
      record.password = await bcrypt.hash(
        record.password,
        await bcrypt.genSalt(),
      )!;
      const additional = {
        referalCode: (await randomString(5)).toUpperCase(),
      };
      let getBonus = false;
      const referalBelongsTo = await prisma.user.findUnique({
        where: { referalCode: record.referal, deletedAt: null },
      });

      console.log(referalBelongsTo);

      if (referalBelongsTo) {
        getBonus = true;
      }
      delete record.referal;

      const bonuses = {
        // UserPointHistory: {
        //   create: {
        //     expiredAt: await setDateNowAndAddMonth(3),
        //     refererId: getBonus ? referalBelongsTo?.id : null,
        //     points: 10000,
        //   },
        // },
        UsersCoupon: {
          create: {
            couponId: 2,
            refererId : referalBelongsTo?.id,
            //createdBy: 1,
            expiredAt: await setDateNowAndAddMonth(3),
          },
        },
      };

      const createdUser = await prisma.$transaction(async (pr) => {
        const newUser = await pr.user.create({
          data: {
            ...record,
            ...additional,
            ...(getBonus ? bonuses : {}),
            //createdBy: 1,
            // Organization: {
            //   create: {
            //     description: 'Hola',
            //     //createdBy: 1,
            //     name:
            //       record.firstName +
            //       ' ' +
            //       `${record.middleName ?? ''}` +
            //       ' ' +
            //       record.lastName +
            //       ' Organization',
            //     OrganizationRole: {
            //       create: {
            //         name: additional.referalCode + 'ownership',
            //         description: 'Hola',
            //         displayName: additional.referalCode + ' Ownership',
            //         //createdBy: 1,
            //         OrganizationRoleHavePermission: {
            //           createMany: {
            //             data: [
            //               {
            //                 permissionId: 2,
            //               },
            //             ],
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
          },
          // include: {
          //   Organization: {
          //     include: {
          //       OrganizationRole: true,
          //     },
          //   },
          // },
        });

        // await pr.userHaveRoleOnOrganization.create({
        //   data: {
        //     userId: newUser.id,
        //     organizationRoleId: newUser.Organization[0].OrganizationRole[0].id,
        //     //createdBy: 1,
        //   },
        // });
        if (getBonus && referalBelongsTo?.username!=='system') {

          await pr.userPointHistory.create({
            data: {
              //createdBy: 1,
              points: 10000,
              expiredAt: await setDateNowAndAddMonth(3),
              userInvitedId: newUser.id,
              userId: referalBelongsTo?.id
            },
          });
        }
        return newUser;
      });

      const returnData: AuthResultInterface = {
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt!,
        updatedAt: createdUser.updatedAt,
        referalCode: createdUser.referalCode,
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

  async checkReferal(
    referalInput: string,
  ): Promise<{ ok: boolean; data?: string | null | undefined }> {
    let result: { ok: boolean; data?: string | null } = {
      ok: false,
    };
    try {
      const referer = await prisma.user.findUnique({
        where: {
          referalCode: referalInput,
        },
        select: {
          username: true,
        },
      });
      if (referer) {
        result.data = referer.username;
        result.ok = true;
      }
    } catch (error) {
      result.ok = false;
    }
    return result;
  }
  async checkEmail(
    emailInput: string,
  ): Promise<{ ok: boolean; data?: string | null | undefined }> {
    let result: { ok: boolean; data?: string | null } = {
      ok: false,
    };
    try {
      const referer = await prisma.user.findUnique({
        where: {
          email: emailInput,
        },
        select: {
          email: true,
        },
      });
      if (referer) {
        result.data = referer.email;
        result.ok = true;
      }
    } catch (error) {
      result.ok = false;
    }
    return result;
  }
  async checkUsername(
    usernameInput: string,
  ): Promise<{ ok: boolean; data?: string | null | undefined }> {
    let result: { ok: boolean; data?: string | null } = {
      ok: false,
    };
    try {
      const referer = await prisma.user.findUnique({
        where: {
          username: usernameInput,
        },
        select: {
          username: true,
        },
      });
      if (referer) {
        result.data = referer.username;
        result.ok = true;
      }
    } catch (error) {
      result.ok = false;
    }
    return result;
  }
}

export const authRepository = new AuthRepository();
