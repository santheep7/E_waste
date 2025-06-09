// src/PickupMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

export default function PickupMap() {
  const [pickupLocations, setPickupLocations] = useState([]);

  useEffect(() => {
    // Replace this with your actual API endpoint
    axios.get('http://localhost:9000/api/req')
      .then((res) => setPickupLocations(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[10.0123, 76.3606]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {pickupLocations.map((pickup, index) => (
          <Marker
            key={index}
            position={[pickup.latitude, pickup.longitude]}
          >
            <Popup>
              {pickup.name}<br />
              {pickup.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
