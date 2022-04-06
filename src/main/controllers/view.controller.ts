import {
    ICustomRequestExpress,
    ICustomResponseExpress,
    ICustomNextFunction,
} from '../../typing/app.type'

export const getOverview = (req: ICustomRequestExpress, res: ICustomResponseExpress) => {
    res.status(200).render('overview', {
        title: 'All Tours',
    })
}

export const getTour = (req: ICustomRequestExpress, res: ICustomResponseExpress) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
    })
}