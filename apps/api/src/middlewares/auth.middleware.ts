import { SignInSchema, SignUpSchema } from '@/validations/auth.validation';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

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
        return res
          .send({
            code: 400,
            message: err.message,
          })
          .status(400);
      });

    // next();
  }

  public async signInValidation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    await SignInSchema.validate(req.body)
    .then(() => next())
    .catch((err) => {
      err.message;
      return res
        .send({
          code: 400,
          message: err.message,
        })
        .status(400);
    });

    // next();
  }
}
