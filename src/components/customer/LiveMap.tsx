"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const labourIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ customerLocation, labourLocation, isTracking }: { customerLocation: [number, number], labourLocation: [number, number], isTracking: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isTracking) {
      const bounds = L.latLngBounds([customerLocation, labourLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(customerLocation, 14);
    }
  }, [customerLocation, labourLocation, isTracking, map]);
  return null;
}

export default function LiveMap({ 
  customerLocation, 
  labourLocation,
  isTracking
}: { 
  customerLocation: [number, number], 
  labourLocation: [number, number],
  isTracking: boolean
}) {
  
  return (
    <MapContainer center={customerLocation} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <Marker position={customerLocation} icon={customerIcon}>
        <Popup>Customer Location</Popup>
      </Marker>

      {isTracking && (
        <>
          <Marker position={labourLocation} icon={labourIcon}>
            <Popup>Labour Live Location</Popup>
          </Marker>
          
          <Polyline 
            positions={[customerLocation, labourLocation]} 
            color="#f59e0b" 
            weight={4}
            dashArray="10, 10"
          />
        </>
      )}
      <MapUpdater customerLocation={customerLocation} labourLocation={labourLocation} isTracking={isTracking} />
    </MapContainer>
  );
}
