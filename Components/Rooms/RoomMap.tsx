'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RoomMapProps {
  roomName: string;
  tower?: string;
  location?: string;
}

const RoomMap = ({ roomName, tower, location }: RoomMapProps) => {
  // Quezon City coordinates (default location)
  const defaultPosition: [number, number] = [14.6760, 121.0437];

  useEffect(() => {
    // Fix for default marker icon issue in Leaflet with Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={defaultPosition}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={defaultPosition}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-gray-800">{roomName}</p>
              {tower && <p className="text-sm text-gray-600">{tower}</p>}
              <p className="text-sm text-gray-600">{location || 'Quezon City'}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RoomMap;
