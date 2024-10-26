import express, {Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler';


const app: Application = express();


//** Default Middlewares */

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(helmet());



//**Routes */



//** Error handler Middleware */

app.use(errorHandler)

export default app;