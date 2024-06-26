import { useEffect, useRef } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const PlaceComponent = ({
  children,
  style,
  address,
  setAddress,
  setLatitude,
  setLongitude,
}) => {
  const inputRef = useRef();

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setAddress(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  const type = ["places"];

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={type}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <div className="relative">
          <input
            type="text"
            className={`form-control ${style}`}
            value={address}
            placeholder="Enter location"
            onChange={(e) => setAddress(e.target.value)}
          />
          {children}
        </div>
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default PlaceComponent;