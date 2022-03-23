import { FilterQuery, Model, PopulateOptions, Query } from 'mongoose'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
  TModels,
} from '../../typing/app.type'
import APIFeatures from '../utils/apiFeatures'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'

export function deleteOne<T extends TModels>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const doc = await model.findByIdAndDelete(req.params.id)

      if (!doc) {
        return next(
          new AppError(
            `No ${model.collection.collectionName} found with that ID`,
            404,
          ),
        )
      }

      res.status(204).json({
        status: 'success',
        [model.collection.collectionName]: doc,
      })
    },
  )
}

export function updateOne<T extends TModels>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const collectionName = model.collection.collectionName
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      if (!doc) {
        return next(
          new AppError(`No ${collectionName} found with the passing ID`, 404),
        )
      }
      res.status(200).json({
        status: 'success',
        [model.collection.collectionName]: doc,
      })
    },
  )
}

export function createOne<T extends TModels>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const doc = await model.create(req.body)
      res.status(201).json({
        status: 'success',
        data: {
          [model.collection.collectionName]: doc,
        },
      })
    },
  )
}

export function getOne<T extends TModels>(
  model: Model<T>,
  populateOpts?: PopulateOptions,
) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const collectionName = model.collection.collectionName

      let query: Query<T | null, T> = model.findById(req.params.id)
      if (populateOpts) query = query!.populate(populateOpts)

      const doc = await query
      if (!doc) {
        return next(
          new AppError(`No ${collectionName} found with the passing ID`, 404),
        )
      }

      res.status(200).json({
        status: 'success',
        [model.collection.collectionName]: doc,
      })
    },
  )
}

type ForeignQueryParam = {
  foreignField: 'tour' | 'review' | 'user'
  paramField: string
}

/**
 *  The function extracts query param and maps to a foreign field (which is a prop of a foreign document)
 */
const setFilterObjByQueryParam = (
  filterObj: ForeignQueryParam,
  req: ICustomRequestExpress,
): ForeignQueryParam | {} => {
  const pName = req.params?.[filterObj.paramField]
  return pName ? { [filterObj.foreignField]: pName } : {}
}

/**
 * Get all documents, applied for nested (e.g. get review on tour) and unnested routes
 *
 * @param {Model} model - A database model
 * @param {ForeignQueryParam=} filterObjWithQueryParam - is a filter object and passed into the query object
 */
export function getAll<T extends TModels>(
  model: Model<T>,
  filterObjWithQueryParam?: ForeignQueryParam,
) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      let filter: FilterQuery<T> = {}

      if (
        filterObjWithQueryParam &&
        Object.keys(filterObjWithQueryParam).length > 0
      ) {
        filter = setFilterObjByQueryParam(
          filterObjWithQueryParam,
          req,
        ) as FilterQuery<T>
      }

      const features = new APIFeatures<T>(model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

      // const docs = await features.query.explain()
      const docs = await features.query

      //SEND REQ
      res.status(200).json({
        status: 'success',
        result: docs.length,
        [model.collection.collectionName]: docs,
      })
    },
  )
}
