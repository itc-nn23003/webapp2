// components/MapComponent.js
import { useEffect } from 'react'

const MapComponent = ({ handleWeatherInfo }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    window.initMap = initMap

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  function initMap () {
    const mapInstance = new window.google.maps.Map(
      document.getElementById('map'),
      {
        center: { lat: 0, lng: 0 },
        zoom: 8
      }
    )

    mapInstance.addListener('click', event => {
      const { latLng } = event
      addWeatherMarker(latLng, mapInstance)
    })
  }

  async function addWeatherMarker (latLng, map) {
    const { lat, lng } = latLng.toJSON()
    const openWeatherApiKey = 'b6977c16d6ce12feb631ffb7d3214ee9'
    const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}&units=metric`

    try {
      const response = await fetch(openWeatherApiUrl)
      const data = await response.json()

      if (response.ok) {
        const weatherDescription = data.weather[0].description
        const temperature = data.main.temp
        const humidity = data.main.humidity

        const weatherInfoContent = `
          Weather: ${weatherDescription}<br>
          Temperature: ${temperature} °C<br>
          Humidity: ${humidity}%
        `

        handleWeatherInfo(weatherInfoContent)

        const infowindow = new window.google.maps.InfoWindow({
          content: weatherInfoContent
        })

        const marker = new window.google.maps.Marker({
          position: latLng,
          map: map
        })

        marker.addListener('click', function () {
          infowindow.open(map, marker)
        })
      } else {
        console.error('Failed to retrieve weather data:', data.message)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  return <div id='map' style={{ height: '400px' }}></div>
}

export default MapComponent
