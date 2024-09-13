// import css from "components/map/Map.module.css";

// export function Map() {
//     return (
//         <></>
//     )
// }

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
// import "components/map/style.json";
// interface MovingObject {
//   id: number;
//   name: string;
//   coordinates: number[];
// }

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // const map = useRef<Map>(null);

//   const movingObjects: MovingObject[] = [
//     // Define your moving objects here
//   ];

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/shenaichan/cm0zvdfvd02b001pqepr2beqo/draft",
        center: [-74.0060152, 40.7127281],
        zoom: 5,
        maxZoom: 15,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add your custom markers and lines here
      // map.addLayer({
      //   id: 'add-erode-font',
      //   type: 'symbol',
      //   layout: {
      //     'text-field': ['get', 'name'],
      //     'text-font': ['Erode']
      //   }
      // });

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ position: "fixed", top: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
};

export default Map;