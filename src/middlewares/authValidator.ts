import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/environment";
import { customAPIError } from "./errorHandler";


interface IPayload {
    user: {
        id: string
    }
}


const generateToken = (payload: IPayload) => {

    try {
        const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: '3h'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '3d'});
        return {accessToken, refreshToken}
    }
    catch(error){
        throw new customAPIError(500, error?.toString()?? "Internal Server Error");
    }

}


const verifyToken = (req: Request, _res: Response, next: NextFunction) => {

    const token: string | boolean = req.headers['authorization']?.split(" ")[1]?? false;

    try{

        if(!token) throw new customAPIError(401, "Token not found for the user");

        const decoded = jwt.verify(token, JWT_SECRET) as string | IPayload;

        if(typeof decoded !== 'string'){
            if(decoded && decoded.user){
                req.userID = decoded.user.id
                next();
            }
        }

    }
    catch(error){
        next(error)
    }

}


export {
    generateToken,
    verifyToken
}