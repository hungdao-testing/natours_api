import mapboxgl from 'mapbox-gl';

type Location = {
  type: string
  coordinates: [number, number]
  day: string,
  description: string
}

export const displayMap = (locations: Location[]) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmFydXRvb25lIiwiYSI6ImNsMjA4ZjFjZzAwNGgzYm51ODV6dDhkeXYifQ.7VYvKm5lLDMaGt_mZPbEpA'

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/narutoone/cl20bb9rx009f15o9f0ml5yye',
    scrollZoom: false,
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach((loc) => {
    // Create marker
    let el = document.createElement('div')
    el.className = 'marker'

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map)

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  })
}
