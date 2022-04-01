let tourData = [
  {
    name: 'The Northern Lights',
  },
  {
    name: 'The Star Gazer',
  },
  {
    name: 'The Wine Taster',
  },
  {
    name: 'The Sports Lover',
  },
  {
    name: 'The Park Camper',
  },
  {
    name: 'The City Wanderer',
  },
  {
    name: 'The Snow Adventurer',
  },
  {
    name: 'The Sea Explorer',
  },
  {
    name: 'The Forest Hiker',
  },
]

let page = 1
let numTourPerPage = 4
for (let i = 0; i < tourData.length; i = i + numTourPerPage) {
  let skippedTour = page * numTourPerPage
  let arr = tourData.slice(i, skippedTour)
  console.log(`Page: ${page} ---`, arr)
  console.log('================')
  page++
}

export function getTourByPagination(
  tours: any,
  pageIndex: number,
  limit: number,
) {
  let skippedTours
  let possiblePages =
    tours.length % limit !== 0
      ? Math.trunc(tours.length / 2) + 1
      : Math.trunc(tours.length / 2)

  if (pageIndex <= possiblePages) {
    skippedTours = (pageIndex - 1) * limit
  } else {
    return
  }

  let data = tours.slice(skippedTours, limit + skippedTours)

  return data
}

getTourByPagination(tourData, 3, 3)
