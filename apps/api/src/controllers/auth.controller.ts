import { Request, Response } from 'express';
import prisma from '@/prisma';
import { authRepository } from '@/repositories/auth.repository';

export class AuthController {
  async register(req: Request, res: Response) {
    const createdUser = await authRepository.createUser(req.body)
    console.log(createdUser);
    
    if (createdUser.ok) {
      return res.send({
        code: 201,
        data : createdUser.data_created,
        ok: true
      })
    }
    return res.send({
      message:"Something wrong in server",
      code: 500
    }).status(500)
  }

}
