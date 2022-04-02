import _ from 'lodash'
import { parseTours } from '../../dev-data/data/parseFile'
import { ITour } from '../../main/models/tour.model'

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

function parseQueryParam(queryParams: string): {
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

export function getTourByPagination(
  tours: ITour[],
  pageIndex = 1,
  limit = 100,
) {
  let skippedTours
  let possiblePages =
    tours.length % limit !== 0
      ? Math.trunc(tours.length / 2) + 1
      : Math.trunc(tours.length / 2)

  if (pageIndex <= possiblePages) {
    skippedTours = (pageIndex - 1) * limit
    return tours.slice(skippedTours, limit + skippedTours)
  } else {
    return []
  }
}

const reviseTourToMonthlyPlan = (
  data: ITour[],
): { name: string; month: number; year: number }[] => {
  let newArr = []
  const tours = data.map((tour) => {
    return _.pick(tour, ['name', 'startDates'])
  })

  for (const tour of tours) {
    for (let i = 0; i < tour.startDates!.length; i++) {
      const month = new Date(tour.startDates![i]).getMonth() + 1
      const year = new Date(tour.startDates![i]).getFullYear()
      newArr.push({ name: tour.name!, month: month, year: year })
    }
  }
  return newArr
}

export function filterToursByYear(year: number) {
  const newArr = reviseTourToMonthlyPlan(parseTours)
  return newArr.filter((el) => el.year === year)
}
