import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { getApprovedPins } from "api/api";
import { FeatureCollection } from "geojson";
import { reverseGeocode } from "api/api";

type MapProps = {
  setPinLocation: (location: [number, number]) => void;
  setMouseLocation: (location: [number, number]) => void;
  spinLevel: number;
  setPlaceName: (placeName: string) => void;
};

function Map({ setPinLocation, setMouseLocation, spinLevel, setPlaceName }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const smallClusterColor: string = '#1084d0';
  const bigClusterColor: string = '#000080';
  const spinLevelRef = useRef(spinLevel);
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  let userInteracting = false;
  let spinEnabled = true;

  function spinGlobe() {
    if (!map.current) return;

    const zoom = map.current.getZoom();
    let speed = spinLevelRef.current * 1.2;
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      if (zoom > slowSpinZoom) {
        // Slow spinning at higher zooms
        const zoomDif =
          (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        speed *= zoomDif;
      }
      const center = map.current.getCenter();
      center.lng -= speed;
      // Smoothly animate the map over one second.
      // When this animation is complete, it calls a 'moveend' event.
      map.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  function startSpin() {
    userInteracting = false;
    spinGlobe();
  }

  function stopSpinWheel() {
    userInteracting = true;
    return spinGlobe();
  }

  function stopSpin() {
    userInteracting = true;
  }

  function handleMoveEnd() {
    spinGlobe();
  }

  useEffect(() => {
    spinLevelRef.current = spinLevel;
    spinGlobe();
  }, [spinLevel]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/shenaichan/cm0zvdfvd02b001pqepr2beqo/draft",
      center: [-73.98505827443357, 40.69136141121903],
      zoom: 2,
      maxZoom: 17,
    });

    if (!map.current) return;

    map.current.on('load', async () => {
      const pins: FeatureCollection = await getApprovedPins();

      if (!map.current) return;

      map.current.addSource('earthquakes', {
        type: 'geojson',
        data: pins,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      map.current.addLayer({
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

      map.current.addLayer({
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

      map.current.addLayer({
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

      // // inspect a cluster on click
      // map.current.on('click', 'clusters', (e) => {
      //   const features = map.current?.queryRenderedFeatures(e.point, {
      //     layers: ['clusters']
      //   });
      //   if (map.current && features && features[0].properties) {
      //     const clusterId = features[0].properties.cluster_id;
      //     const source: mapboxgl.GeoJSONSource = map.current.getSource('earthquakes') as mapboxgl.GeoJSONSource

      //     source
      //       .getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
      //         if (err) return;
      //         if (features[0].geometry.type == "Point") {
      //           map.current?.easeTo({
      //             center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
      //             zoom: zoom
      //           });
      //         }
      //       });
      //   }
      // });

      // // When a click event occurs on a feature in
      // // the unclustered-point layer, open a popup at
      // // the location of the feature, with
      // // description HTML from its properties.
      // map.current.on('click', 'unclustered-point', (e) => {
      //   if (e.features && e.features[0].properties && e.features[0].geometry.type == "Point") {
      //     const coordinates = e.features[0].geometry.coordinates.slice();
      //     const mag = e.features[0].properties.mag;
      //     const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

      //     // Ensure that if the map is zoomed out such that
      //     // multiple copies of the feature are visible, the
      //     // popup appears over the copy being pointed to.
      //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //       coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      //     }

      //     new mapboxgl.Popup()
      //       .setLngLat([coordinates[0], coordinates[1]])
      //       .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
      //       .addTo(map.current!);
      //   }
      // });

      map.current.on('mouseenter', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
      });

    });

    map.current.on('mousedown', stopSpin);
    map.current.on('mouseup', startSpin);
    map.current.on('zoom', stopSpin);
    map.current.on('zoomend', startSpin);
    map.current.on('wheel', stopSpinWheel);

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    map.current.on('dragend', startSpin);
    map.current.on('pitchend', startSpin);
    map.current.on('rotateend', startSpin);

    // When animation is complete, start spinning if there is no ongoing interaction
    map.current.on('moveend', handleMoveEnd);

    spinGlobe();

    map.current.on('click', function (e) {
      var coordinates = e.lngLat;
      setPinLocation([coordinates.lng, coordinates.lat]);
      setMouseLocation([e.point.x, e.point.y]);
      reverseGeocode(coordinates.lat, coordinates.lng).then(placeName => {
        setPlaceName(placeName);
      });
    });

    // Clean up on unmount
    return () => map.current?.remove();
  }, []);

  return (
    <>
      <div
        ref={mapContainer}
        style={{ position: "fixed", top: 0, width: "100%", height: "100%", zIndex: 0 }}
      />
    </>
  );
};

export default Map;