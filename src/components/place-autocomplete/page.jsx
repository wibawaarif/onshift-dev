import { useRef } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const PlaceComponent = ({style, address, setAddress, setLatitude, setLongitude }) => {
  const inputRef = useRef();

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setAddress(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  const type = ["places"]


  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={type}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <input
          value={address}
          type="text"
          className={`form-control ${style}`}
          placeholder={address}
        />
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default PlaceComponent;
