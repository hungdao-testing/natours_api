const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken =
  'pk.eyJ1IjoibmFydXRvb25lIiwiYSI6ImNsMjA4ZjFjZzAwNGgzYm51ODV6dDhkeXYifQ.7VYvKm5lLDMaGt_mZPbEpA'

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
})
