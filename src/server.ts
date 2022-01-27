import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';
import { TourModel } from './models/tourModel';


dotenv.config({ path: './config.env' });
const DB_URI = process.env.DB_CONN_STRING!.replace('<PASSWORD>', process.env.DB_PASSWORD!);
mongoose.connect(DB_URI).then(conn => {
    console.log("DB connection is established!")
});



const testTour: mongoose.Document = new TourModel({
    name: 'The Parent Forest Hiking',
    //rating: 4.7,
    price: 497
});
testTour.save().then(doc => {
    console.log(doc);
}).catch(e => { console.log("Error on saving database: ", e) })


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});