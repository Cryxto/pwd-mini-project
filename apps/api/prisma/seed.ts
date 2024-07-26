import crypto from 'crypto';
import { EventType, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
// import { createUserInDB } from '@/utils/seeder.utils';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const categories = [
  { id: 1, displayName: 'Music', name: 'music' },
  { id: 2, displayName: 'Art', name: 'art' },
  { id: 3, displayName: 'Technology', name: 'technology' },
  { id: 4, displayName: 'Sports', name: 'sports' },
  { id: 5, displayName: 'Food', name: 'food' },
  { id: 6, displayName: 'Education', name: 'education' },
];

async function setDateNowAndAddMonth(month: number) {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() + month);
  return newDate;
}
async function randomString(length: number = 10) {
  return crypto.randomBytes(length).toString('hex');
}

interface UserSeedInterface {
  middleName?: string | undefined;
  referal?: string | undefined;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

async function createUserSeed(): Promise<UserSeedInterface> {
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
    firstName: firstName,
    lastName: lastName,
    password: password,
    email: email,
    username: username,
    middleName: faker.person.middleName(),
  };
}

async function makeEvent(orgId: number) {
  return {
    title: faker.lorem.words(3),
    slug: faker.lorem.slug(),
    content: faker.lorem.paragraphs(2),
    eventType: EventType.PAID,
    categoryId: faker.helpers.arrayElement(categories).id,
    heldAt: faker.date.soon({ refDate: await setDateNowAndAddMonth(2), days:20 }),
    registrationStartedAt: faker.date.recent({days:10}),
    registrationClosedAt: faker.date.soon({
      refDate: await setDateNowAndAddMonth(1),
      days: 20
    }),
    location: faker.location.city(),
    locationLink: faker.internet.url(),
    quota: faker.number.int({ min: 100, max: 200 }),
    basePrices: parseFloat(faker.commerce.price({ min: 50000, max: 1000000 })),
    enrollment: faker.number.int({ min: 0, max: 99 }),
    organizerId: orgId,
  };
}

export async function createUserSeedBulk(
  howMany: number = 5,
): Promise<UserSeedInterface[]> {
  let stack: UserSeedInterface[] = [];
  for (let i = 0; i < howMany; i++) {
    stack.push(await createUserSeed());
  }
  return stack;
}

export async function createUserInDB(howMany: number = 5) {
  try {
    const users = await createUserSeedBulk(howMany);
    const createdUsers = [];
    let reff: string | null = null;

    for (const [i, record] of users.entries()) {
      const additional = {
        referalCode: (await randomString(5)).toUpperCase(),
      };
      let getBonus = false;
      if (reff) {
        record.referal = reff as string;
      }
      const referalBelongsTo = await prisma.user.findUnique({
        where: { referalCode: record.referal || '13sd', deletedAt: null },
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
            Organization: {
              create: {
                description: 'Hola',
                //createdBy: 1,
                name: `${record.firstName} ${record.middleName ?? ''} ${record.lastName} Organization`,
                OrganizationRole: {
                  create: {
                    name: `${additional.referalCode}ownership`,
                    description: 'Hola',
                    displayName: `${additional.referalCode} Ownership`,
                    //createdBy: 1,
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
            //createdBy: 1,
          },
        });

        if (getBonus && referalBelongsTo?.username !== 'system') {
          await pr.userPointHistory.create({
            data: {
              //createdBy: 1,
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
        ...createdUser,
      });
      if (i % 2 === 0) {
        reff = createdUser.referalCode;
      } else {
        reff = null;
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

async function main() {
  try {
    // Create a superuser
    const superuser = prisma.user.create({
      data: {
        id: 1,
        email: 'system.myEvent@gmail.com',
        firstName: 'My Event',
        lastName: 'System',
        username: 'system',
        password: await bcrypt.hash(
          process.env.SUPERUSER_PASSWORD!,
          await bcrypt.genSalt(),
        ),
        referalCode: crypto.randomBytes(5).toString('hex').toUpperCase(),
      },
    });
    const superUserUpdate = prisma.user.update({
      data: {
        //createdBy: 1,
      },
      where: { id: 1 },
    });

    // Create permissions
    const permissions = prisma.permission.createMany({
      data: [
        {
          id: 1,
          name: 'superuser',
          displayName: 'Superuser',
          description: 'For system only',
          //createdBy: 1,
        },
        {
          id: 2,
          name: 'ownership',
          displayName: 'Ownership',
          description: 'Organization ownership permission',
          //createdBy: 1,
        },
        {
          id: 3,
          name: 'create_event',
          displayName: 'Create Event',
          description: 'Create event permission',
          //createdBy: 1,
        },
        {
          id: 4,
          name: 'update_event',
          displayName: 'Update Event',
          description: 'Update event permission',
          //createdBy: 1,
        },
        {
          id: 5,
          name: 'delete_event',
          displayName: 'Delete Event',
          description: 'Delete event permission',
          //createdBy: 1,
        },
        {
          id: 6,
          name: 'view_event',
          displayName: 'View Event',
          description: 'View event permission',
          //createdBy: 1,
        },
        {
          id: 7,
          name: 'access_event',
          displayName: 'Access Event',
          description: 'Access event permission',
          //createdBy: 1,
        },
        {
          id: 8,
          name: 'event_attendee_privilege',
          displayName: 'Event Attendee',
          description: 'Event attendee privilege',
          //createdBy: 1,
        },
      ],
      skipDuplicates: true,
    });
    // Create roles
    const superuserRole = prisma.role.create({
      data: {
        name: 'superuser',
        displayName: 'Superuser',
        description: 'Has all permissions',
        //createdBy: 1,
        RoleHavePermission: {
          createMany: {
            data: [
              { permissionId: 1 }, //createdBy: 1 }, // Superuser permission
              { permissionId: 2 }, //createdBy: 1 }, // Ownership permission
              { permissionId: 3 }, //createdBy: 1 }, // Create Event permission
              { permissionId: 4 }, //createdBy: 1 }, // Update Event permission
              { permissionId: 5 }, //createdBy: 1 }, // Delete Event permission
              { permissionId: 6 }, //createdBy: 1 }, // View Event permission
              { permissionId: 7 }, //createdBy: 1 }, // Access Event permission
              { permissionId: 8 }, //createdBy: 1 }, // Event Attendee privilege
            ],
            skipDuplicates: true,
          },
        },
      },
    });

    const ownerRole = prisma.role.create({
      data: {
        name: 'organization_owner',
        displayName: 'Organization Owner',
        description: 'Full CRUD permissions for events',
        //createdBy: 1,
        RoleHavePermission: {
          createMany: {
            data: [
              { permissionId: 3 }, // Create Event permission
              { permissionId: 4 }, // Update Event permission
              { permissionId: 5 }, // Delete Event permission
              { permissionId: 6 }, // View Event permission
              { permissionId: 7 }, // Access Event permission
            ],
            skipDuplicates: true,
          },
        },
      },
    });

    const visitorRole = prisma.role.create({
      data: {
        name: 'visitor',
        displayName: 'Visitor',
        description: 'No special permissions',
        //createdBy: 1,
      },
    });

    // Create an organization with owner
    const organization = prisma.organization.create({
      data: {
        name: 'myEvent',
        description: 'Default organization description',
        ownerId: 1,
        //createdBy: 1,
      },
    });

    // Assign roles to the superuser
    const assignSuperuserRole = prisma.userHaveRole.create({
      data: {
        userId: 1,
        roleId: 1, // Assuming Superuser Role ID is 1
        //createdBy: 1,
      },
    });

    const coupon = prisma.coupon.create({
      data: {
        id: 1,
        code: crypto.randomBytes(7).toString('hex').toUpperCase(),
        //createdBy: 1,
        issuedBy: 1,
        monthCouponAlive: 3,
        title: 'New Comer Welcome',
        description: 'Get 10% discount to desired event',
        discount: 10,
        unit: 'percent',
      },
    });

    const category = prisma.category.createMany({ data: categories });

    // Wait for all promises to complete before committing the transaction
    const [
      user,
      updateSuperUser,
      permissionsResult,
      superuserRoleResult,
      ownerRoleResult,
      visitorRoleResult,
      organizationResult,
      roleAssignment,
      couponCreated,
      categoryCreated,
    ] = await prisma.$transaction([
      superuser,
      superUserUpdate,
      permissions,
      superuserRole,
      ownerRole,
      visitorRole,
      organization,
      assignSuperuserRole,
      coupon,
      category,
    ]);

    console.log({
      user,
      permissionsResult,
      superuserRoleResult,
      ownerRoleResult,
      visitorRoleResult,
      organizationResult,
      roleAssignment,
      updateSuperUser,
      couponCreated,
    });

    const bulk = await createUserInDB(40);
    const orgs = await prisma.organization.findMany();

    // const events = await prisma.$transaction(async (pr) => {
    //   const bulkEv = orgs.map(async (e) =>
    //     await pr.event.create({
    //       data: {
    //         ...(await makeEvent(e.id)),
    //       },
    //     }),
    //   );
    //   return bulkEv;
    // });

    const events = await Promise.all(
      orgs.map(
        async (e) =>
          await prisma.event.create({
            data: await makeEvent(e.id),
          }),
      ),
    );

    console.log(bulk);
    console.log(events);

    // go continue to make me the event seeder
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
