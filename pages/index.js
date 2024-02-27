import { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axios from 'axios'

const containerStyle = {
  width: '100%',
  height: '700px'
}

const center = {
  lat: 26.5,
  lng: 127.9
}
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
      // 現在の天気情報を取得
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${event.latLng.lat()}&lon=${event.latLng.lng()}&appid=${
          process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        }&units=metric&lang=ja`
      )
      setCurrentWeather(currentWeatherResponse.data)

      // 1週間の天気情報を取得
      const weeklyWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${event.latLng.lat()}&lon=${event.latLng.lng()}&appid=${
          process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        }&units=metric&lang=ja`
      )

      // 週間の天気情報から各日の平均気温と平均湿度を計算
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
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
      {currentWeather && (
        <div>
          <h2>現在の天気</h2>
          <p>気温: {currentWeather.main.temp} °C</p>
          <p>湿度: {currentWeather.main.humidity} %</p>
          <p>天気: {currentWeather.weather[0].description}</p>
        </div>
      )}
      {weeklyForecast.length > 0 && (
        <div>
          <h2>一週間の天気予報</h2>
          <ul>
            {weeklyForecast.map((forecast, index) => (
              <li key={index}>
                <p>日付: {forecast.date}</p>
                <p>平均気温: {forecast.avgTemp.toFixed(2)} °C</p>
                <p>平均湿度: {forecast.avgHumidity.toFixed(2)} %</p>
                <p>天気: {forecast.weather}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </LoadScript>
  )
}

export async function getStaticProps () {
  return {
    props: {
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }
  }
}

export default MapComponent
