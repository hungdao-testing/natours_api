import { NextFunction, Request, Response } from 'express';
import { TourModel } from '../models/tourModel';

export const aliasTopTour = async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

export const getAllTours = async (req: Request, res: Response) => {
    try {

        console.log(req.query);

        // //BUILD QUERY
        // No need to exclude query params which are not in the schema in latest Mongoose version
        // Udemy source: https://mongoosejs.com/docs/tutorials/query_casting.html#the-strictquery-option
        //


        // const queryObj = { ...req.query };
        // const excludeFields = ['page', 'sort', 'limit', 'fields'];

        // excludeFields.forEach(field => delete queryObj[field]);
        // 1) Filtering
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = TourModel.find(JSON.parse(queryStr));

        // 2) Sort
        if (req.query.sort) {
            // In Mongoose, to sort multiple props, we pass a list of props with the white-space between them
            // => e.g. sort("price ratingsAverage")
            // But in Postname, to sort multiple props, we use pattern `sort=prop1,prop2` 
            // => First, we need to split props by "," (comma); then join by white-space. 
            const sortBy = req.query.sort.toString().split(",").join(" ");

            query = query.sort(sortBy)
        } else {
            //https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065094#questions/12847927
            //https://stackoverflow.com/questions/49760024/why-mongodb-sort-by-id-is-much-faster-than-sort-by-any-other-indexed-field
            query = query.sort({ _id: -1 });
        }

        //3) Limiting 
        if (req.query.fields) {
            const fields = req.query.fields.toString().split(",").join(" ");
            query = query.select(fields)
        } else {
            //here `-` means : excluding
            query.select('-__v')
        }
        //4) Pagination
        const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100;
        const skip = (page - 1) * limit;


        //page=2&limit=10 => 1-10 is page 1, 11-20 is page 2
        query = query.skip(skip).limit(limit);

        const numTours = await TourModel.countDocuments();
        if (skip >= numTours) throw new Error('This page does not exist');

        //EXECUTE QUERY
        const tours = await query;

        //SEND REQ
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error });
    }
};

export const getTour = async (req: Request, res: Response) => {
    try {
        const tour = await TourModel.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

export const createTour = async (req: Request, res: Response) => {
    try {
        const newTour = await TourModel.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

export const updateTour = async (req: Request, res: Response) => {
    try {
        const newTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,

        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

export const deleteTour = async (req: Request, res: Response) => {
    try {

        await TourModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(204).json({
            status: 'fail',
            message: error
        });
    }
};
