import { Request, Response } from 'express';
import { authRepository } from '@/repositories/auth.repository';
import prisma from '@/prisma';
import { genJWT } from '@/utils/jwt.utils';
import { AuthJWTInterface } from '@/interfaces/auth.interface';

export class AuthController {
  async signUp(req: Request, res: Response) {
    const createdUser = await authRepository.createUser(req.body);
    // console.log(createdUser);

    if (createdUser.ok) {
      return res
        .send({
          code: 201,
          data: createdUser.data_created,
          ok: true,
        })
        .status(201);
    }
    return res
      .send({
        message: 'Something wrong in server',
        code: 500,
      })
      .status(500);
  }
  public async sigIn(req: Request, res: Response): Promise<void | Response> {
    const { identifier } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
        deletedAt: null,
      },
      select: {
        email: true,
        id: true,
        username: true,
        referalCode: true,
        firstName: true,
        lastName: true,
        middleName: true,
      },
    });
    const bearerAuth = await genJWT(user as AuthJWTInterface);
    // res.cookie('authToken', `Bearer ${bearerAuth}`, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 5 * 1000,
    // });
    // res.cookie('Authorization', bearerAuth, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 5 * 1000,
    //   sameSite:"lax"
    // })
    return res
      // .cookie('auth_token', bearerAuth, {
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 5 * 1000,
      //   sameSite: 'lax',
      // })
      // .cookie('verification', require('crypto').randomBytes(48).toString('base64url'),{
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 5 * 1000,
      //   sameSite: 'strict',
      // })
      .send({
        // token: bearerAuth || 'dsad',
        auth_token: bearerAuth,
        verification: require('crypto').randomBytes(48).toString('base64url'),
        code: 200,
        ok: true,
      })
      .status(200);
  }
}
