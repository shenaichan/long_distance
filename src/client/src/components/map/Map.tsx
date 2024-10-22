import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { getApprovedPins, getPlaceName, PinInPrivate, PinInPublic } from "api/api";
import { coordinates, mouseLocation, creationState, NO_COORDINATES } from "components/App";
import map_pin from "assets/map_pin.png";

type MapProps = {
  setPinLocation: (location: coordinates) => void;
  setMouseLocation: (location: mouseLocation) => void;
  spinLevel: number;
  setPlaceName: (placeName: string) => void;
  currState: creationState;
  setCurrState: (state: creationState) => void;
  highlightedPin: PinInPrivate | PinInPublic | null;
  setHighlightedPin: (pin: PinInPrivate | PinInPublic | null) => void;
  pins: PinInPrivate[];
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  let earthsRadius = 6371

  const [ y1, y2, x1, x2 ]  = [lat1, lat2, lon1, lon2].map( deg => deg * Math.PI / 180 )
  const dy = y2 - y1
  const dx = x2 - x1
  const a = Math.sin(dy / 2)**2 + Math.cos(y1) * Math.cos(y2) * Math.sin(dx / 2)**2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthsRadius * c

  return distance
}

function Map({ setPinLocation, setMouseLocation, spinLevel, setPlaceName, currState, setCurrState, highlightedPin, setHighlightedPin, pins }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const smallClusterColor: string = '#1084d0';
  const bigClusterColor: string = '#000080';
  const spinLevelRef = useRef(spinLevel);
  const currStateRef = useRef(currState);
  const maxZoom = 17;
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  let userInteracting = false;
  let spinEnabled = true;

  function openPinMenu(feature: GeoJSON.Feature) {
    setCurrState("pinMenu");
    if (feature.geometry.type === "Point" && feature.properties) {
      const pin = pins.find(pin => pin.id === feature.properties!.id);
      if (pin) {
        setHighlightedPin(pin);
      }
      else {
        setHighlightedPin({id: feature.properties.id, 
          latitude: feature.geometry.coordinates[1], 
          longitude: feature.geometry.coordinates[0], 
          place_name: feature.properties.place_name, 
          public_share_token: feature.properties.public_share_token});
      }
    }

  }

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
    if (!highlightedPin) return;
    if (highlightedPin.longitude !== NO_COORDINATES.longitude && highlightedPin.latitude !== NO_COORDINATES.latitude) {
      const { lng, lat } = map.current!.getCenter()
      const distance = haversineDistance(lat, lng, highlightedPin.latitude, highlightedPin.longitude)
      console.log(distance)
      map.current?.flyTo({
        center: [highlightedPin.longitude, highlightedPin.latitude],
        zoom: maxZoom,
        essential: true,
        duration: 1500 + (maxZoom - map.current.getZoom()) * 250 + (distance) * 1.5
      });
    }
  }, [highlightedPin]);

  useEffect(() => {
    currStateRef.current = currState;
    if (!map.current) return;
    if (!mapContainer.current) return;
    if (currState === "none" || currState === "pinCreation" || currState === "destinationCreation") {
      if (currState === "pinCreation" || currState === "destinationCreation") {
        mapContainer.current.style.cursor = `url(${map_pin}) 16 32, auto`;
      }
      else {
        mapContainer.current.style.cursor = "default";
      }
      map.current.scrollZoom.enable();
      map.current.boxZoom.enable();
      map.current.dragPan.enable();
      map.current.doubleClickZoom.enable();
      map.current.touchZoomRotate.enable();
      map.current.dragRotate.enable();
      map.current.touchZoomRotate.enableRotation();
    }
    else {
      mapContainer.current.style.cursor = "default";
      map.current.scrollZoom.disable();
      map.current.boxZoom.disable();
      map.current.dragPan.disable();
      map.current.doubleClickZoom.disable();
      map.current.touchZoomRotate.disable();
      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();
    }
  }, [currState]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/shenaichan/cm0zvdfvd02b001pqepr2beqo/draft",
      center: [-73.98505827443357, 40.69136141121903],
      zoom: 2,
      maxZoom: maxZoom,
    });

    if (!map.current) return;

    map.current.on('load', async () => {
      const pins: FeatureCollection = await getApprovedPins();

      if (!map.current) return;

      map.current.addSource('pins', {
        type: 'geojson',
        data: pins,
        // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'pins',
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
        source: 'pins',
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
        source: 'pins',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': smallClusterColor,
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // // inspect a cluster on click
      map.current.on('click', 'clusters', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        if (map.current && features && features[0].properties) {
          const clusterId = features[0].properties.cluster_id;
          const source: mapboxgl.GeoJSONSource = map.current.getSource('pins') as mapboxgl.GeoJSONSource

          source
            .getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
              if (err) return;
              if (features[0].geometry.type == "Point") {
                map.current?.easeTo({
                  center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
                  zoom: zoom
                });
              }
            });
        }
      });

      map.current.on('click', 'unclustered-point', (e) => {
        if (currStateRef.current === "pinCreation" || currStateRef.current === "destinationCreation") return;
        if (e.features && e.features[0].properties && e.features[0].geometry.type == "Point") {
          console.log(e.features[0])
          console.log(e.features[0].geometry.coordinates.slice());
          const coordinates = e.features[0].geometry.coordinates.slice();

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          openPinMenu(e.features[0]);
        }
      });

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
      if (!map.current) return;
      if ((currStateRef.current === "pinCreation" || currStateRef.current === "destinationCreation") && map.current.getZoom() > 5) {
        var coordinates = e.lngLat;
        setPinLocation({longitude: coordinates.lng, latitude: coordinates.lat});
        map.current.flyTo({
          center: [coordinates.lng, coordinates.lat],
          zoom: maxZoom,
          essential: true,
          duration: 1500 + (maxZoom - map.current.getZoom()) * 250
        });
        setMouseLocation({x: window.innerWidth / 2, y: window.innerHeight / 2});
        if (currStateRef.current === "pinCreation") {
          setCurrState("pinConfirmation");
        }
        else {
          setCurrState("destinationConfirmation");
        }
        getPlaceName(coordinates.lat, coordinates.lng).then(placeName => {
          console.log(placeName);
          setPlaceName(placeName);
        });
      }
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