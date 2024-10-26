import dotenv from 'dotenv';


const envFile: string = process.env.NODE_ENV === 'production' ? '.env.production': '.env.development';
dotenv.config({path: envFile});


//** Export the Server PORT */
export const PORT: string = process.env.PORT || '3000';