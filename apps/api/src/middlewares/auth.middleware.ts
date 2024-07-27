import { verifyJWT } from '@/utils/jwt.utils';
import { SignInSchema, SignUpSchema } from '@/validations/auth.validation';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default class AuthMiddleware {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  public async signUpValidation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    await SignUpSchema.validate(req.body, { abortEarly: false })
      .then(() => next())
      .catch((err) => {
        err.message;
        return res.status(400).send({
          code: 400,
          error: err,
          body : req.body
        });
      });

    // next();
  }

  public async signInValidation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    await SignInSchema.validate(req.body, { abortEarly: false })
      .then(() => next())
      .catch((err) => {
        err.message;
        return res.status(400).send({
          code: 400,
          error: err,
        });
      });

    // next();
  }

  public async shouldSignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    if (!req.headers.authorization) {
      // return res.send({ message: 'hola' });
      return res.status(401).send({ message: 'unauthorized' });
    }
    const jwtPayload = await verifyJWT(req.headers.authorization)
    console.log(req.headers.authorization);
    
    if (!jwtPayload) {
      return res.status(422).send({ message: 'authorization token being tempered' });
    }
    req.body.jwtPayload  = jwtPayload as jwt.JwtPayload
    next()
  }
}
