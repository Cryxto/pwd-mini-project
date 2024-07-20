import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import AuthMiddleware from '@/middlewares/auth.middleware';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/', this.authController.getSampleData);
    // this.router.get('/:id', this.authController.getSampleDataById);
    this.router.post(
      '/sign-up',
      this.authMiddleware.signUpValidation,
      this.authController.signUp,
    );
    this.router.post(
      '/sign-in',
      this.authMiddleware.signInValidation,
      this.authController.sigIn,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
