// pages/index.js
import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false
})

export default function Home () {
  const [weatherInfo, setWeatherInfo] = useState('')

  const handleWeatherInfo = info => {
    setWeatherInfo(info)
  }

  return (
    <div>
      <Head>
        <title>Weather Map</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1>Weather Map</h1>
        <MapComponent handleWeatherInfo={handleWeatherInfo} />
        <div dangerouslySetInnerHTML={{ __html: weatherInfo }}></div>
      </main>

      <footer>
        <p>Powered by Next.js</p>
      </footer>
    </div>
  )
}
