import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { setDateNowAndAddMonth } from './date.utils';
import prisma from '@/prisma';
import { randomString } from './string.utils';

export interface UserSeedInterface {
  middleName?: string | undefined;
  referal?: string | undefined;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export async function createUserSeed(): Promise<UserSeedInterface> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = await bcrypt.hash('password', await bcrypt.genSalt());
  const email = faker.internet.email({
    firstName: firstName,
    lastName: lastName,
  });
  const username = faker.internet.userName({
    firstName: firstName,
    lastName: lastName,
  });
  return {
    firstName : firstName,
    lastName : lastName,
    password :password,
    email :email,
    username : username,
    middleName: faker.person.middleName()
  }
}

export async function createUserSeedBulk(howMany:number = 5) : Promise<UserSeedInterface[]> {
  let stack : UserSeedInterface[] = []
  for (let i = 0; i < howMany; i++) {
    stack.push(await createUserSeed())
  }
  return stack
}

export async function createUserInDB(howMany:number  = 5 ) {
  try {
    const users = await createUserSeedBulk(howMany);
    const createdUsers = [];
    let reff : string|null = ''

    for (const [i,record] of users.entries()) {
      const additional = {
        referalCode: (await randomString(5)).toUpperCase(),
      };
      let getBonus = false;
      if (reff) {
        record.referal = reff as string
      } 
      const referalBelongsTo = await prisma.user.findUnique({
        where: { referalCode: record.referal, deletedAt: null },
      });

      console.log(referalBelongsTo);

      if (referalBelongsTo) {
        getBonus = true;
      }
      delete record.referal;

      const bonuses = {
        UserPointHistory: {
          create: {
            expiredAt: await setDateNowAndAddMonth(3),
            refererId: getBonus ? referalBelongsTo?.id : null,
            points: 10000,
          },
        },
        UsersCoupon: {
          create: {
            couponId: 1,
            createdBy: 1,
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
            createdBy: 1,
            Organization: {
              create: {
                description: 'Hola',
                createdBy: 1,
                name: `${record.firstName} ${record.middleName ?? ''} ${record.lastName} Organization`,
                OrganizationRole: {
                  create: {
                    name: `${additional.referalCode}ownership`,
                    description: 'Hola',
                    displayName: `${additional.referalCode} Ownership`,
                    createdBy: 1,
                    OrganizationRoleHavePermission: {
                      createMany: {
                        data: [
                          {
                            permissionId: 2,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          include: {
            Organization: {
              include: {
                OrganizationRole: true,
              },
            },
          },
        });

        await pr.userHaveRoleOnOrganization.create({
          data: {
            userId: newUser.id,
            organizationRoleId: newUser.Organization[0].OrganizationRole[0].id,
            createdBy: 1,
          },
        });

        if (getBonus && referalBelongsTo?.username !== 'system') {
          await pr.userPointHistory.create({
            data: {
              createdBy: 1,
              points: 10000,
              expiredAt: await setDateNowAndAddMonth(3),
              userInvitedId: newUser.id,
              userId: referalBelongsTo?.id,
            },
          });
        }

        return newUser;
      });

      createdUsers.push({
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt!,
        updatedAt: createdUser.updatedAt,
        referalCode: createdUser.referalCode,
      });
      if (i%2===0) {
        reff = createdUser.referalCode
      } else {
        reff = null
      }
    }

    return {
      ok: true,
      data_created: createdUsers,
    };
  } catch (error) {
    return {
      ok: false,
      data_created: [],
      error: error,
    };
  }
}