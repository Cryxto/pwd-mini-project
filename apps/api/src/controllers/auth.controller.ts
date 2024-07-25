import { Request, Response } from 'express';
import { authRepository } from '@/repositories/auth.repository';
import prisma from '@/prisma';
import { genJWT } from '@/utils/jwt.utils';
import { AuthJWTInterface } from '@/interfaces/auth.interface';
import { CheckEmailSchema } from '@/validations/auth.validation';

export class AuthController {
  async signUp(req: Request, res: Response) {
    
    const createdUser = await authRepository.createUser(req.body);
    
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
    return (
      res
        .send({
          // token: bearerAuth || 'dsad',
          auth_token: bearerAuth,
          verification: require('crypto').randomBytes(48).toString('base64url'),
          code: 200,
          ok: true,
        })
        .status(200)
    );
  }

  public async checkEmail (req: Request, res: Response): Promise<void | Response> {
    const email = req.params.email
    if (!email) {
      return res.status(400).send({message: 'email is empty'})
    }
    console.log(email);
    
    const emailVerification = await CheckEmailSchema.isValid({email: email})

    if (!emailVerification) {
      return res.status(400).send({message: 'email is invalid', exist:false})
    }

    const isEmailExist = await authRepository.checkEmail(email)
    if (!isEmailExist.ok) {
      return res.status(200).send({message: 'can be used', exist:false})
    }
    return res.status(409).send({message: 'found use another one', exist: true})
  }
  
  public async checkUsername (req: Request, res: Response): Promise<void | Response> {
    const username = req.params.username
    if (!username) {
      return res.status(400).send({message: 'username is empty'})
    }
    const isUsernameExist = await authRepository.checkUsername(username)
    if (!isUsernameExist.ok) {
      return res.status(200).send({message: 'can be used', exist:false})
    }
    return res.status(409).send({message: 'found, use another one', exist: true})
  }

  public async checkReferal (req: Request, res: Response): Promise<void | Response> {
    const referal = req.params.referal
    if (!referal) {
      return res.status(400).send({message: 'referal is empty'})
    }
    const isReferalExist = await authRepository.checkReferal(referal)
    if (isReferalExist.ok) {
      return res.status(200).send({message: 'can be used', exist:true})
    }
    return res.status(200).send({message: 'not found, use another one', exist: false})
  }
}
