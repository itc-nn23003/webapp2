// GoogleMapComponent.js
import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '700px'
}

const center = {
  lat: 26.5,
  lng: 127.9
}

const GoogleMapComponent = ({ markerPosition, handleMapClick }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapComponent
