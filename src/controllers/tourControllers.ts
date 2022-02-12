import { NextFunction, Request, Response } from 'express';
import { TourModel } from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';

export const aliasTopTour = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

export const getAllTours = async (req: Request, res: Response) => {
    try {
        const features = new APIFeatures(TourModel.find(), req.query)
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

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
            runValidators: true
        });
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
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

export const getTourStats = async (req: Request, res: Response) => {
    try {
        const stats = await TourModel.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty', //group by field.
                    numRatings: { $sum: '$ratingsQuantity' },
                    numTours: { $sum: 1 }, //tips: add `1` to each document going through pipe and accumulating them.
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 } // 1 means ascending.
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

export const getMonthlyPlan = async (req: Request, res: Response) => {
    try {
        const year = req.params.year ? parseInt(req.params.year) : 1;
        const plan = await TourModel.aggregate([
            {
                $unwind: '$startDates' //$unwind is used to deconstruct an array
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numToursStart: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: { _id: 0 } // field name = 0 inside the `project` state, means this field not shown up, and `1` is shown up
            },
            {
                $sort: {
                    numToursStart: -1
                }
            },
            { $limit: 12 }
        ]);

        res.status(200).json({
            status: 'success',
            data: plan
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};
