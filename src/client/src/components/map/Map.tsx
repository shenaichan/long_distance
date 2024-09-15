// import css from "components/map/Map.module.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { getApprovedPins } from "api/api";
import { FeatureCollection } from "geojson";

function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const smallClusterColor: string = '#1084d0';
  const bigClusterColor: string = '#000080';

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/shenaichan/cm0zvdfvd02b001pqepr2beqo/draft",
        center: [-73.98505827443357, 40.69136141121903],
        zoom: 2,
        maxZoom: 17,
      });


      map.on('load', async () => {
        const pins: FeatureCollection =  await getApprovedPins();
        map.addSource('earthquakes', {
          type: 'geojson',
          data: pins,
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
              'interpolate',
              ['linear'],
              ['get', 'point_count'],
              100,
              smallClusterColor,
              750,
              bigClusterColor
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
  
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Roboto Mono Regular', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            "text-color": "#ffffff"
          }
        });
  
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': smallClusterColor,
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

      // The following values can be changed to control rotation speed:

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 120;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;

    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
                // Slow spinning at higher zooms
                const zoomDif =
                    (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            // Smoothly animate the map over one second.
            // When this animation is complete, it calls a 'moveend' event.
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    }

    // Pause spinning on interaction
    map.on('mousedown', () => {
        userInteracting = true;
    });

    // Restart spinning the globe when interaction is complete
    map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
    });

    // Pause spinning on interaction
    map.on('zoom', () => {
        userInteracting = true;
    });

    // Restart spinning the globe when interaction is complete
    map.on('zoomend', () => {
        userInteracting = false;
        spinGlobe();
    });

    map.on('wheel', () => {
      userInteracting = true;
      // userInteracting = false;
      // spinGlobe();
      // event type: boxzoomstart
      return spinGlobe();
    });

    // map.on('zoomend', () => {
    //   userInteracting = false;
    //   spinGlobe();
    //   // event type: boxzoomstart
    // });

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    map.on('dragend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('pitchend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('rotateend', () => {
        userInteracting = false;
        spinGlobe();
    });

    // When animation is complete, start spinning if there is no ongoing interaction
    map.on('moveend', () => {
        spinGlobe();
    });

    spinGlobe();

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