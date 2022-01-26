import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { Tour } from '../types/Tour';





const tours: Tour[] = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString()
);


export const checkID = (req: Request, res: Response, next: NextFunction, val: string) => {
    console.log(`Tour id is: ${val}`);
    const id: number = parseInt(req.params["id"]);
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
};

export const getAllTours = (req: Request, res: Response) => {

    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

export const getTour = (req: Request, res: Response) => {
    console.log(req.params);
    const id: number = parseInt(req.params["id"]);

    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

export const createTour = (req: Request, res: Response) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );
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