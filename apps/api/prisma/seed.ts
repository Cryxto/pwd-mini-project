import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
        createdBy:1,
      }, where: {id:1}
    })

    // Create permissions
    const permissions = prisma.permission.createMany({
      data: [
        {
          id:1,
          name: 'superuser',
          displayName: 'Superuser',
          description: 'For system only',
          createdBy: 1,
        },
        {
          id:2,
          name: 'ownership',
          displayName: 'Ownership',
          description: 'Organization ownership permission',
          createdBy: 1,
        },
        {
          id:3,
          name: 'create_event',
          displayName: 'Create Event',
          description: 'Create event permission',
          createdBy: 1,
        },
        {
          id:4,
          name: 'update_event',
          displayName: 'Update Event',
          description: 'Update event permission',
          createdBy: 1,
        },
        {
          id:5,
          name: 'delete_event',
          displayName: 'Delete Event',
          description: 'Delete event permission',
          createdBy: 1,
        },
        {
          id:6,
          name: 'view_event',
          displayName: 'View Event',
          description: 'View event permission',
          createdBy: 1,
        },
        {
          id:7,
          name: 'access_event',
          displayName: 'Access Event',
          description: 'Access event permission',
          createdBy: 1,
        },
        {
          id:8,
          name: 'event_attendee_privilege',
          displayName: 'Event Attendee',
          description: 'Event attendee privilege',
          createdBy: 1,
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
        createdBy: 1,
        RoleHavePermission: {
          createMany: {
            data: [
              { permissionId: 1 }, // Superuser permission
              { permissionId: 2 }, // Ownership permission
              { permissionId: 3 }, // Create Event permission
              { permissionId: 4 }, // Update Event permission
              { permissionId: 5 }, // Delete Event permission
              { permissionId: 6 }, // View Event permission
              { permissionId: 7 }, // Access Event permission
              { permissionId: 8 }, // Event Attendee privilege
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
        createdBy: 1,
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
        createdBy: 1,
      },
    });

    // Create an organization with owner
    const organization = prisma.organization.create({
      data: {
        name: 'myEvent',
        description: 'Default organization description',
        ownerId: 1,
        createdBy: 1,
      },
    });

    // Assign roles to the superuser
    const assignSuperuserRole = prisma.userHaveRole.create({
      data: {
        userId: 1,
        roleId: 1, // Assuming Superuser Role ID is 1
        createdBy:1
      },
    });

    // Wait for all promises to complete before committing the transaction
    const [
      user,
      permissionsResult,
      superuserRoleResult,
      ownerRoleResult,
      visitorRoleResult,
      organizationResult,
      roleAssignment,
      updateSuperUser
    ] = await prisma.$transaction([
      superuser,
      permissions,
      superuserRole,
      ownerRole,
      visitorRole,
      organization,
      assignSuperuserRole,
      superUserUpdate,
    ]);

    console.log({
      user,
      permissionsResult,
      superuserRoleResult,
      ownerRoleResult,
      visitorRoleResult,
      organizationResult,
      roleAssignment,
      updateSuperUser
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
