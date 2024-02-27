const WeeklyForecast = ({ weeklyForecast }) => {
  return (
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
  )
}

export default WeeklyForecast
