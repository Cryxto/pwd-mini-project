import { ENV } from '@/config';
import { NextFunction, Request, Response } from 'express';

export default class ServerMiddleware {
  public async verifyApiKey(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const {API_KEY} = ENV
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
      return res.status(403).json({ message: 'Forbidden'});
    }
    next();
  }
}
