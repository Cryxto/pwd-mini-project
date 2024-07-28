import { EventController } from '@/controllers/event.controller';
import AuthMiddleware from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventController: EventController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.eventController = new EventController();
    this.authMiddleware = new AuthMiddleware()
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/transaction',
    this.authMiddleware.shouldSignIn ,this.eventController.makeTransaction);
    this.router.get('/:slug',this.authMiddleware.shouldSignIn, this.eventController.getSingleEvent);
    this.router.get('/', this.eventController.getAllEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
