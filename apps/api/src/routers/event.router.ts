import { EventController } from '@/controllers/event.controller';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:slug', this.eventController.getSingleEvent);
    this.router.get('/', this.eventController.getAllEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
