import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';



process.on("uncaughtException", (err: Error) => {
    console.log("Uncaught Exception!!! -- Shuttting down");
    console.log(err.name, err.message);
    process.exit(1);
})

dotenv.config({ path: './config.env' });
const DB_URI = process.env.DB_CONN_STRING!.replace('<PASSWORD>', process.env.DB_PASSWORD!);
mongoose.connect(DB_URI).then(conn => {
    console.log("DB connection is established!")
});



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err: Error) => {
    console.log("Unhandle Rejection!!! -- Shuttting down");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1)
    })
})
