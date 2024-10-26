import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { customAPIError } from "./errorHandler";


const validateRequest  = (req: Request, _res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    try{
        if(!errors.isEmpty()){
            const message = errors.array()[0].msg;
            throw new customAPIError(400, message)
        }
        next();
    }
    catch(e){
        next(e);
    }

}


export default validateRequest;