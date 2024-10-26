import app from "./app";
import { createServer, Server } from "http";
import { PORT } from "./config/environment";


const server: Server = createServer(app);


//** Start the server on the port */
server.listen(PORT, () => {
    console.log(`The Server is listening to the port ${PORT}`);
});


//** Unhandled Rejection */
process.on('unhandledRejection', (reason, _promise) => {
    console.log(`An Unhhandled Rejection Occured due to: ${reason}`);
})


//** Uncaught Exception */
process.on('uncaughtException', (reason, _promise) => {
    console.log(`An Uncaught Exception Occured due to: ${reason}`);
});