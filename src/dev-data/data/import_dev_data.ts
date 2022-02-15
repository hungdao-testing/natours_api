import dotenv from 'dotenv';
import app from '../../app';
import mongoose from 'mongoose';
import fs from 'fs';
import { TourModel } from '../../models/tourModel';


dotenv.config({ path: './config.env' });
const DB_URI = process.env.DB_CONN_STRING!.replace('<PASSWORD>', process.env.DB_PASSWORD!);
mongoose.connect(DB_URI).then(conn => {
    console.log("DB connection is established!")
});


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data
const importData = async function () {
    try {
        await TourModel.create(tours);
        console.log("Data is successfully loaded!!!");
        process.exit();
    } catch (error) {
        console.log("Could not import data because of: ", error)
    }
}

// Delete data
const deleteData = async function () {
    try {
        await TourModel.deleteMany();
        console.log("Data is successfully deleted!!!");
        process.exit();

    } catch (error) {
        console.log("Could not delete data because of: ", error)
    }
}
if (process.argv[2] == "--import") {
    importData()
} else if (process.argv[2] == "--delete") {
    deleteData()
}