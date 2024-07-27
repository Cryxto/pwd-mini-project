import { UserController } from '@/controllers/user.controller';
import AuthMiddleware from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/profile', this.authMiddleware.shouldSignIn, this.userController.getUserProfile);
  }

  getRouter(): Router {
    return this.router;
  }
}
