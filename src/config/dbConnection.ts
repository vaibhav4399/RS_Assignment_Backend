import { Pool, PoolClient } from "pg";
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DB } from "./environment";



const dbPool: Pool = new Pool({
   host: DB_HOST,
   port: DB_PORT,
   user: DB_USER,
   password: DB_PASS,
   database: DB_DB,
   max: 20,
   idleTimeoutMillis: 20000,
   connectionTimeoutMillis: 3000 
});


const checkPoolConnection = async () => {
    try{
        const client: PoolClient = await dbPool.connect();
        client.release()
    }
    catch(e){
        throw new Error(e?.toString());
    }
}


checkPoolConnection();


export default dbPool;