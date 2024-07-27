import { Request, Response } from 'express';
import { userRepository } from '@/repositories/user.repository';

export class UserController {
  public async getUserProfile (req: Request, res: Response): Promise<void | Response> {
    if (!req.body.jwtPayload) {
      return res.status(404).send('not found')
    }
    const data = await userRepository.getProfile(req.body.jwtPayload.id)
    delete req.body.jwtPayload
    if (data.ok) {
      return res.status(200).send({
        data: data.data
      })
    }
    return res.status(500).send({
      message : data.error
    })
  }
}
