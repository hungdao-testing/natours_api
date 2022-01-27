import mongoose from 'mongoose';

//Ref: https://mongoosejs.com/docs/typescript/schemas.html
export interface Tour extends mongoose.Document{
    id: number;
    name: string;
    rating?: number,
    price: number;

}


const tourSchema = new mongoose.Schema<Tour>({
    id: Number,
    name: { type: String, required: [true, 'A tour must have name'], unique: true },
    price: { type: Number, required: [true, 'A tour must have price'] },
    rating: { type: Number, default: 4.5 },
})


export const TourModel = mongoose.model<Tour>('Tour', tourSchema);
