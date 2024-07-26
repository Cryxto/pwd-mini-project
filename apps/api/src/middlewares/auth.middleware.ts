import { SignInSchema, SignUpSchema } from '@/validations/auth.validation';
import { NextFunction, Request, Response } from 'express';

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
    if (req.cookies.verification && req.cookies.auth_token) {
      return res.send({ cookies: req.cookies });
    }
    return res.status(401).send({ message: 'unauthorized' });
  }
}
