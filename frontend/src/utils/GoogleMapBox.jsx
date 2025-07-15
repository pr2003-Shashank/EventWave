// components/GoogleMapBox.jsx
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "25rem",
  borderRadius: "8px",
};

const GoogleMapBox = ({ lat, lng }) => {
  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: lat, lng: lng }}
        zoom={16}
        mapTypeId="hybrid"
        disableDefaultUI={ true}
        options={{
            cameraControl:false,
            fullscreenControl:false
        }}
      >
        <Marker position={{ lat: lat, lng: lng }} />
      </GoogleMap>
  );
};

export default GoogleMapBox;
