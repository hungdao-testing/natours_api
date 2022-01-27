import { NextFunction, Request, Response } from 'express';
import { Tour, TourModel } from '../models/tourModel';



export const getAllTours = (req: Request, res: Response) => {

    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,

    });
};

export const getTour = (req: Request, res: Response) => {
    console.log(req.params);
    const id: number = parseInt(req.params["id"]);

    // const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',

    });
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
        })
    }
};

export const updateTour = (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

export const deleteTour = (req: Request, res: Response) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};