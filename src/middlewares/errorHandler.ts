import { Request, Response, NextFunction } from "express";


//** class to create a Custon Error */

class customAPIError extends Error{
    
    status: number;
    
    constructor(status: number = 500, message: string){
        super(message);
        this.status = status;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}



const errorHandler = (error:customAPIError | Error, _req: Request, res: Response, _next: NextFunction) => {

    if(error instanceof customAPIError){
        const response = {
            status: error.status,
            message: error.message,
            timestamp: new Date().toISOString()
        }

        res.status(error.status).json(response);
    }
    else {  
        const response = {
            status: 500,
            message: error.message,
            timestamp: new Date().toISOString()
        }
    
        res.status(500).json(response);
    }


}


export default errorHandler;

export {customAPIError};