// import css from "components/map/Map.module.css";

// export function Map() {
//     return (
//         <></>
//     )
// }

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// interface MovingObject {
//   id: number;
//   name: string;
//   coordinates: number[];
// }

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

//   const movingObjects: MovingObject[] = [
//     // Define your moving objects here
//   ];

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-74.0060152, 40.7127281],
        zoom: 5,
        maxZoom: 15,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    />
  );
};

export default Map;