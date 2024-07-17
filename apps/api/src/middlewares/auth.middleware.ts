import { AuthSchema } from "@/validations/auth.validation";
import { NextFunction, Request, Response } from "express";

export default class AuthMiddleware {
  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  public async registerValidation (req: Request, res: Response, next: NextFunction): Promise<Response|void>  {
    try {
      await AuthSchema.validate(req.body);
    } catch (error) {
      return res.send(
        {
          code : 400,
          message : error
        }
      ).status(400)
    }

    next();
  }
  
} 