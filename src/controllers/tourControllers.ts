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
        res.status(204).json({
            status: 'fail',
            message: error
        });
    }
};
