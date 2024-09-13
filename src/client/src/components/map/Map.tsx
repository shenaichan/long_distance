// import css from "components/map/Map.module.css";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import erode from "assets/Erode/Erode-Variable.ttf";

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

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

      map.on('load', () => {
        map.addSource('earthquakes', {
          type: 'geojson',
          data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
  
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });
  
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
  
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 10,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
  
        // inspect a cluster on click
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          if (map && features[0].properties) {
            const clusterId = features[0].properties.cluster_id;
            const source: mapboxgl.GeoJSONSource = map.getSource('earthquakes') as mapboxgl.GeoJSONSource

            source
            .getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
              if (err) return;
              if (features[0].geometry.type == "Point") {
                map.easeTo({
                  center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
                  zoom: zoom
                });
              }
              
            });

            
          }

        });
  
        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e) => {
          if (e.features && e.features[0].properties && e.features[0].geometry.type == "Point") {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const mag = e.features[0].properties.mag;
            const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
    
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    
            new mapboxgl.Popup()
              .setLngLat([coordinates[0], coordinates[1]])
              .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
              .addTo(map);
          }

        });
  
        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });
      });

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