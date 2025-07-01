import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

export default function MapSelector({ onLocationSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCkT9Lb1F13pbxm8L5PAkZGlL_F_oVcjNA", // 🔁 Replace with your actual key
  });

  const [marker, setMarker] = useState(null);

  const handleClick = (e) => {
    const pos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(pos);
    onLocationSelect(pos);
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={marker || center}
      zoom={12}
      onClick={handleClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
