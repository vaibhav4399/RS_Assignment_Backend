import {Request, Response, NextFunction} from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dbPool from '../config/dbConnection';
import { PoolClient } from 'pg';
import { USERTABLE } from '../config/environment';
import { customAPIError } from '../middlewares/errorHandler';
import { generateToken } from '../middlewares/authValidator';



const register = async (req: Request, res: Response, next: NextFunction) => {

    const client: PoolClient  =  await dbPool.connect();
    
    if(!client) throw new Error("Could not get client from the database");

    try{

        const {username, email, password} = req.body;

        let user = await client.query(`SELECT id from ${USERTABLE} WHERE username = $1 OR email = $2`, [username, email]);

        if(user.rowCount) throw new customAPIError(400, "The user with the given Username or Email already exists");

        const userID = uuidv4();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt)

        const newUser = await client.query(`INSERT INTO ${USERTABLE} (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id`, [userID, username, email, hashedPassword]);

        if(newUser.rowCount == 0) throw new customAPIError(500, "Something went wrong when creating the user");

        const payload = {
            user: {
                id: newUser.rows[0].id
            }
        }

        const {accessToken, refreshToken} = generateToken(payload);

        const response = {
            userID: newUser.rows[0].id,
            accessToken: accessToken
        }

        res.cookie('rT', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);

    }
    catch(error){
        next(error);
    }
    finally {
        client.release();
    }

}


const login = async (req: Request, res: Response, next: NextFunction) => {

    const client: PoolClient = await dbPool.connect();
    if(!client) throw new Error("Client not found for database connection");

    try{

        const {username, password} = req.body;

        const user = await client.query(`SELECT id, password FROM ${USERTABLE} WHERE username = $1`, [username]);

        if(user.rowCount == 0) throw new customAPIError(401, "Could not find the user with the given username");

        const passMatch = await bcrypt.compare(password, user.rows[0].password);

        if(!passMatch) throw new customAPIError(401, "The given password did not match");

        const payload = {
            user: {
                id: user.rows[0].id
            }
        }

        const { accessToken, refreshToken } = generateToken(payload);

        const response = {
            userID: user.rows[0].id,
            accessToken: accessToken
        }

        res.cookie('rT', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);


    }
    catch(error){
        next(error);
    }
    finally{
        client.release();
    }

}



export const authController = {
    register,
    login
}