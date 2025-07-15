// components/LocationMap.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fixing default marker icon (optional but recommended)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationMarker = ({ position, onChange }) => {
  useMapEvents({
    click(e) {
      onChange({
        lat: e.latlng.lat.toFixed(6),
        lng: e.latlng.lng.toFixed(6),
      });
    },
  });
  return <Marker position={position} />;
};

const LocationMap = ({ coords, setCoords }) => {
  return (
    <MapContainer
      center={coords}
      zoom={13}
      style={{ height: "200px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={coords} onChange={setCoords} />
    </MapContainer>
  );
};

export default LocationMap;
