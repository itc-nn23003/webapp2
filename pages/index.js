import { useState } from 'react'
import axios from 'axios'
import CurrentWeather from '../components/CurrentWeather'
import WeeklyForecast from '../components/WeeklyForecast'
import GoogleMapComponent from '../components/GoogleMapComponent'

const MapComponent = ({ googleMapsApiKey }) => {
  const [markerPosition, setMarkerPosition] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [weeklyForecast, setWeeklyForecast] = useState([])

  const handleMapClick = async event => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    })

    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${event.latLng.lat()}&lon=${event.latLng.lng()}&appid=${
          process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        }&units=metric&lang=ja`
      )
      setCurrentWeather(currentWeatherResponse.data)

      const weeklyWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${event.latLng.lat()}&lon=${event.latLng.lng()}&appid=${
          process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        }&units=metric&lang=ja`
      )

      const dailyAverages = {}
      weeklyWeatherResponse.data.list.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0]
        if (!dailyAverages[date]) {
          dailyAverages[date] = {
            tempSum: 0,
            humiditySum: 0,
            weather: forecast.weather[0].description,
            count: 0
          }
        }
        dailyAverages[date].tempSum += forecast.main.temp
        dailyAverages[date].humiditySum += forecast.main.humidity
        dailyAverages[date].count++
      })

      const weeklyForecastData = []
      for (const date in dailyAverages) {
        const avgTemp = dailyAverages[date].tempSum / dailyAverages[date].count
        const avgHumidity =
          dailyAverages[date].humiditySum / dailyAverages[date].count
        weeklyForecastData.push({
          date: date,
          avgTemp: avgTemp,
          avgHumidity: avgHumidity,
          weather: dailyAverages[date].weather
        })
      }

      setWeeklyForecast(weeklyForecastData)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  return (
    <div>
      <GoogleMapComponent
        markerPosition={markerPosition}
        handleMapClick={handleMapClick}
      />
      <CurrentWeather currentWeather={currentWeather} />
      <WeeklyForecast weeklyForecast={weeklyForecast} />
    </div>
  )
}

export default MapComponent
