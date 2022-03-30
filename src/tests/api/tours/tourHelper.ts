import _, { sortBy } from 'lodash'
import { parseTours } from '../../../dev-data/data/parseFile'
import { ITour } from '../../../main/models/tour.model'

function isGreaterThan(param: number, comparedParam: number) {
  return param > comparedParam
}

function isGreaterEqualThan(param: number, comparedParam: number) {
  return param >= comparedParam
}

function isLessThan(param: number, comparedParam: number) {
  return param < comparedParam
}

function isLessEqualThan(param: number, comparedParam: number) {
  return param <= comparedParam
}

type comparisonOp = 'lte' | 'lt' | 'gte' | 'gt'
const predicateFunc: Record<
  comparisonOp,
  (number1: number, number2: number) => boolean
> = {
  gt: (number1: number, number2: number) => isGreaterThan(number1, number2),
  gte: (number1: number, number2: number) =>
    isGreaterEqualThan(number1, number2),
  lt: (number1: number, number2: number) => isLessThan(number1, number2),
  lte: (number1: number, number2: number) => isLessEqualThan(number1, number2),
}

function parseQueryParam(
  queryParams: string,
): {
  param: string
  comparisonOperator: comparisonOp | unknown
  comparedParam: unknown
}[] {
  const rawData = queryParams.split('&')
  return rawData.map((raw) => {
    let obj = raw.split('=')
    const target = obj[0].split(/\[(lt|lte|gt|gte)\]/)
    const param = target[0]
    const comparisonOperator = target[1]
    const comparedParam = obj[1]

    return { param, comparisonOperator, comparedParam }
  })
}

const fixedQueryParamKeywords = ['sort', 'fields', 'page', 'limit']

export function filterToursByQueryParam(filterParams: string) {
  let tours = parseTours
  const queryParams = parseQueryParam(filterParams)
  queryParams.forEach((el) => {
    if (
      el.comparisonOperator !== undefined &&
      !fixedQueryParamKeywords.includes(el.param)
    ) {
      tours = tours.filter((tour) => {
        return predicateFunc[el.comparisonOperator as comparisonOp](
          tour[el.param as keyof ITour],
          el.comparedParam as number,
        )
      })
    }
  })
  return tours
}

export function sortToursByQueryParam(
  sortParam: string,
  tours: ITour[],
): ITour[] {
  let newTours: ITour[] = []
  const sortStr = sortParam.split('=')[1]
  const sortProps = sortStr.split(',')

  sortProps.forEach((sortProp) => {
    if (sortProp.includes('-')) {
      sortProp = sortProp.replace('-', '')
      newTours = tours.sort(
        (obj1, obj2) =>
          obj2[sortProp as keyof ITour] - obj1[sortProp as keyof ITour],
      )
    } else {
      newTours = tours.sort(
        (obj1, obj2) =>
          obj1[sortProp as keyof ITour] - obj2[sortProp as keyof ITour],
      )
    }
  })
  return newTours
}

// export function limitFieldsOfTours(limitFieldParam: string, tours: ITour[]) {
//     let newTours: (Partial<Pick<ITour, keyof ITour>>)[] = []
//     const limitFieldStr = limitFieldParam.split("=")[1];
//     const limitFieldProps = limitFieldStr.split(",");

//     limitFieldProps.forEach(prop => {
//         tours.forEach(tour => {
//             let newObj: any;
//             if (prop.includes("-")) {
//                 prop = prop.replace("-", "");
//                 newObj = _.omit(tour, prop as keyof ITour);
//             } else {
//                 newObj = { [prop]: tour[prop as keyof ITour] }
//             }
//         })
//         newTours.push(newObj)

//     })
//     return newTours;
// }

// const tours = filterToursByQueryParam("price[lt]=1000&ratingsAverage[gt]=4")
// console.log(limitFieldsOfTours("fields=name,ratingsAverage", tours));
// sortToursByQueryParam("sort=-price,ratingsAverage", tours).forEach(el => console.log({ name: el.name, price: el.price, ratingsAverage: el.ratingsAverage }))
