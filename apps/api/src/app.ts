import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { PORT } from './config';
// import { SampleRouter } from './routers/sample.router';
import { AuthRouter } from './routers/auth.router';
import ServerMiddleware from './middlewares/server.middleware';
import { EventRouter } from './routers/event.router';
import { UserRouter } from './routers/user.router';

export default class App {
  private app: Express;
  private serverMiddleware : ServerMiddleware

  constructor() {
    this.app = express();
    this.configure();
    this.serverMiddleware = new ServerMiddleware()
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send(req.headers);
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    // const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouter()
    const eventRouter = new EventRouter()
    const userRouter = new UserRouter()

    this.app.use(this.serverMiddleware.verifyApiKey)

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    // this.app.use('/api/samples', sampleRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/event', eventRouter.getRouter());
    this.app.use('/api/user', userRouter.getRouter());

  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
