import { useEffect, useState } from 'react'

const MapComponent = ({ handleWeatherInfo }) => {
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=&callback=initMap'
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
        center: { lat: 26.2124, lng: 127.6809 },
        zoom: 8
      }
    )

    setMap(mapInstance)

    mapInstance.addListener('click', event => {
      const { latLng } = event
      addWeatherMarker(latLng)
    })
  }

  async function addWeatherMarker (latLng) {
    const { lat, lng } = latLng.toJSON()
    const openWeatherApiKey = ''
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

        // 前のマーカーが存在する場合、削除する
        if (marker) {
          marker.setMap(null)
        }

        // 新しいマーカーを追加する
        const newMarker = new window.google.maps.Marker({
          position: latLng,
          map: map
        })

        setMarker(newMarker)
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
