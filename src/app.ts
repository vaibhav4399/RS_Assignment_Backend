import express, {Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler';
import authRouter from './routes/authRoutes';


const app: Application = express();


//** Default Middlewares */

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(helmet());



//**Routes */

app.use('api/auth', authRouter);

//** Error handler Middleware */

app.use(errorHandler)

export default app;