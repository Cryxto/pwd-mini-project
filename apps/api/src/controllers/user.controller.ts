import { Request, Response } from 'express';
import { userRepository } from '@/repositories/user.repository';
import { genJWT } from '@/utils/jwt.utils';

export class UserController {
  public async getUserProfile (req: Request, res: Response): Promise<void | Response> {
    if (!req.body.jwtPayload) {
      return res.status(404).send('not found')
    }
    const data = await userRepository.getProfile(req.body.jwtPayload.id)
    const newToken = await genJWT({
      email : data.data?.email,
      id : data.data?.id,
      firstName : data.data?.firstName,
      lastName : data.data?.lastName,
      referalCode : data.data?.referalCode,
      username : data.data?.username,
      middleName : data.data?.middleName
    })
    delete req.body.jwtPayload
    if (data.ok) {
      return res.status(200).send({
        data: data.data,
        auth_token : newToken
      })
    }
    return res.status(500).send({
      message : data.error
    })
  }
}
