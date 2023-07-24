
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState,useEffect } from "react";
import PaperPlane from "@public/static/jsx/paperplane"
import './style.css'

const GoogleMaps = ({setLatitude, setLongitude, latitude, longitude}) => {
  const [map, setMap] = useState(/** @types google.maps.Map */(null));

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), []);

  const changeCoordinate = (coord, index) => {
    const { latLng } = coord
    const lat = latLng.lat();
    const lng = latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
  }

  useEffect(() => {
    map?.panTo({lat: latitude, lng: longitude})
  }, [latitude, longitude])


  return (
    <div className="w-full h-96">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
          onLoad={map => setMap(map)}
        >
          <button className="z-50 flex justify-center items-center w-8 h-8 transition duration-300 rounded-full hover:bg-stone-200 bg-stone-100 border-2 border-cyan-400 absolute right-[60px] top-[17px]" onClick={() => map.panTo({lat: latitude, lng: longitude})}>
            <PaperPlane className="w-4 h-4" />
          </button>
          <Marker draggable animation={google.maps.Animation.DROP} onDragEnd={changeCoordinate} position={{ lat: latitude, lng: longitude }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMaps;