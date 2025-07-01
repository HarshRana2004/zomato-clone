import React, { useEffect, useRef } from "react";

const MapPicker = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.209 }, // Default: New Delhi
        zoom: 13,
      });

      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelect({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setPosition(e.latLng);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: e.latLng,
            map,
          });
        }
      });
    }
  }, [onLocationSelect]);

  return (
    <div
      ref={mapRef}
      style={{ height: "300px", width: "100%", borderRadius: "12px", marginTop: "12px" }}
    />
  );
};

export default MapPicker;
