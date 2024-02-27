const CurrentWeather = ({ currentWeather }) => {
  return (
    <div>
      <h2>現在の天気</h2>
      {currentWeather && (
        <div>
          <p>気温: {currentWeather.main.temp} °C</p>
          <p>湿度: {currentWeather.main.humidity} %</p>
          <p>天気: {currentWeather.weather[0].description}</p>
        </div>
      )}
    </div>
  )
}

export default CurrentWeather
