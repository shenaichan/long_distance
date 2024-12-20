import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { getApprovedPins, getApprovedRoutes, getPlaceName, getMessageThread } from "api/api";
import map_pin from "assets/map_pin.png";
import { useAppState } from "state/context"
import { center } from "@turf/center"
import { distance } from "@turf/distance"
import { points } from "@turf/helpers"



function Map() {

  const { setSourceLocation, setDestLocation, spinLevel, setSourcePlaceName, setDestinationPlaceName,
    sourceState, setSourceState, destState, setDestState,
    pinIsHighlighted, setPinIsHighlighted, highlightedPin, setHighlightedPin, 
    pins, highlightedThread, setHighlightedThread, threadIsHighlighted, setThreadIsHighlighted,
    setNumWorldNotes, randomNote
  } = useAppState()

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const smallClusterColor: string = '#1084d0';
  const bigClusterColor: string = '#000080';
  const spinLevelRef = useRef(spinLevel);
  // const currStateRef = useRef(currState);
  const sourceStateRef = useRef(sourceState);
  const destStateRef = useRef(destState);
  const pinIsHighlightedRef = useRef(pinIsHighlighted);
  const maxZoom = 16;
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  let userInteracting = false;
  const spinEnabledRef = useRef(true);

  const allPinsRef = useRef<FeatureCollection>()
  const allNotesRef = useRef<FeatureCollection>()

  async function openMessageMenu(sender_id: number, recipient_id: number){
    const thread = await getMessageThread(sender_id, recipient_id)
    setHighlightedThread(thread)
    setThreadIsHighlighted(true)
    setPinIsHighlighted(false)
  }

  function openPinMenu(feature: GeoJSON.Feature) {
    // setCurrState("pinMenu");
    setThreadIsHighlighted(false)
    setPinIsHighlighted(true)
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
    console.log("spin enabled is ", spinEnabledRef.current)
    if (spinEnabledRef.current && !userInteracting && zoom < maxSpinZoom) {
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
    if (randomNote === -1) return;
    console.log(allNotesRef.current)
    const feature = allNotesRef.current!.features[randomNote]
    openMessageMenu(feature.properties!.sender_id, feature.properties!.recipient_id)
  }, [randomNote])

  useEffect(() => {
    spinLevelRef.current = spinLevel;
    spinGlobe();
  }, [spinLevel]);

  useEffect(() => {
    if (!highlightedPin) return;
    if (!pinIsHighlighted) return;
    // if (highlightedPin.longitude !== NO_COORDINATES.longitude && highlightedPin.latitude !== NO_COORDINATES.latitude) {
    const { lng, lat } = map.current!.getCenter()
    const dist = distance([lng, lat], [highlightedPin.longitude, highlightedPin.latitude])
    console.log(dist)
    if (!isNaN(highlightedPin.longitude) && !isNaN(highlightedPin.latitude) ) {
      map.current?.flyTo({
        center: [highlightedPin.longitude, highlightedPin.latitude],
        zoom: maxZoom,
        essential: true,
        duration: 1500 + (maxZoom - map.current.getZoom())**1.2 * 250 * dist**0.85/1000
      });
    }
    // }
  }, [highlightedPin, pinIsHighlighted]);

  useEffect(() => {
    if (map.current && map.current.getLayer('temp-line')) {
        map.current.removeLayer('temp-line');
    }
    
    // Check if the source exists
    if (map.current && map.current.getSource('temp-line')) {
        map.current.removeSource('temp-line');
    }
    if (!highlightedThread) return;
    if (!threadIsHighlighted) {
      spinEnabledRef.current = true; 
      if (!pinIsHighlighted) {
        spinGlobe();
      } 
      return;}

    const coords = [[ highlightedThread.sender.longitude,
      highlightedThread.sender.latitude ] ,
    [ highlightedThread.recipient.longitude,
      highlightedThread.recipient.latitude ]]
    // Add the GeoJSON source for the line
    map.current!.addSource('temp-line', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coords
            },
            properties: {
            }
        }
    });

    // Add the layer to visualize the line
    map.current!.addLayer({
        id: 'temp-line',
        type: 'line',
        source: 'temp-line',
        paint: {
            'line-color': smallClusterColor, // Line color
            'line-width': 4        // Line width
        }
    });
  
    const { lng, lat } = map.current!.getCenter()
    const {geometry} = center(points([[ highlightedThread.sender.longitude,
                                               highlightedThread.sender.latitude ] ,
                                             [ highlightedThread.recipient.longitude,
                                               highlightedThread.recipient.latitude ]]
    ))
    const [threadLong, threadLat] = geometry.coordinates
    console.log(geometry)
    const jumpDist = distance([lng, lat], [threadLong, threadLat])
    const threadDist = distance(coords[0], coords[1])
    const zoom = (1 - threadDist/20004)**1.3 * 2.0 + 2
    if (!isNaN(threadLong) && !isNaN(threadLat) ) {
      map.current?.flyTo({
        center: [threadLong, threadLat],
        zoom: zoom,
        essential: true,
        duration: 1500 + Math.abs(zoom - map.current.getZoom())**1.2 * 50 * jumpDist**0.85/750 
      });
    }
    spinEnabledRef.current = false;
    // }
  }, [highlightedThread, threadIsHighlighted]);

  useEffect(() => {
    // currStateRef.current = currState;
    sourceStateRef.current = sourceState;
    destStateRef.current = destState;
    console.log("source state is", sourceState)
    console.log("dest state is", destState)
    pinIsHighlightedRef.current = pinIsHighlighted;
    if (!map.current) return;
    if (!mapContainer.current) return;
    if ( sourceState === "confirming" || destState === "confirming" || pinIsHighlighted) {
      mapContainer.current.style.cursor = "default";
      map.current.scrollZoom.disable();
      map.current.boxZoom.disable();
      map.current.dragPan.disable();
      map.current.doubleClickZoom.disable();
      map.current.touchZoomRotate.disable();
      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();
    }
    else {
      // Check if the layer exists
      if (map.current.getLayer('temp-point')) {
          map.current.removeLayer('temp-point');
      }
      
      // Check if the source exists
      if (map.current.getSource('temp-point')) {
          map.current.removeSource('temp-point');
      }
      if ( sourceState === "selecting" || destState === "selecting" ) {
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
  }, [ sourceState, destState, pinIsHighlighted ]);

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
      // tellServerMapLoaded();
      allPinsRef.current = await getApprovedPins();
      allNotesRef.current = await getApprovedRoutes();
      setNumWorldNotes(allNotesRef.current.features.length)


      if (!map.current) return;

      map.current.addSource('routes', {
        'type': 'geojson',
        'data': allNotesRef.current
      });

      map.current.addLayer({
        'id': 'routes',
        'source': 'routes',
        'type': 'line',
        'paint': {
            'line-width': 1.5,
            'line-color': '#007cbf'
        }
      });

      map.current.addLayer({
        'id': 'routes-hitbox',
        'source': 'routes',
        'type': 'line',
        'paint': {
            'line-width': 10,
            'line-opacity': 0
        }
      });

      map.current.addSource('pins', {
        type: 'geojson',
        data: allPinsRef.current,
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

      map.current.on('mouseenter', 'unclustered-point', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'unclustered-point', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('mouseenter', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'clusters', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('mouseenter', 'routes-hitbox', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'routes-hitbox', () => {
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
      if (( sourceStateRef.current === "selecting" || destStateRef.current === "selecting" )) {
        var coordinates = e.lngLat;
        if ( sourceStateRef.current === "selecting" ) {
          setSourceLocation({longitude: coordinates.lng, latitude: coordinates.lat});
        } else {
          setDestLocation({longitude: coordinates.lng, latitude: coordinates.lat});
        }

            // Check if the layer exists
        if (map.current.getLayer('temp-point')) {
            map.current.removeLayer('temp-point');
        }
        
        // Check if the source exists
        if (map.current.getSource('temp-point')) {
            map.current.removeSource('temp-point');
        }

        map.current.addSource('temp-point', {
          type: 'geojson',
          data: {
              type: 'FeatureCollection',
              features: [
                  {
                      type: 'Feature',
                      geometry: {
                          type: 'Point',
                          coordinates: [coordinates.lng, coordinates.lat]
                      },
                      properties: {}
                  }
              ]
            }
        });

            // Add the layer to visualize the point
        map.current.addLayer({
            id: 'temp-point',
            type: 'circle',
            source: 'temp-point',
            paint: {
              'circle-color': smallClusterColor,
              'circle-radius': 10,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff'
            }
        });
        
        const { lng, lat } = map.current!.getCenter()
        const dist = distance([lng, lat], [coordinates.lng, coordinates.lat])
        console.log(dist)
        if (!isNaN(coordinates.lng) && !isNaN(coordinates.lat) ) {
          map.current?.flyTo({
            center: [coordinates.lng, coordinates.lat],
            zoom: maxZoom,
            essential: true,
            duration: 1500 + (maxZoom - map.current.getZoom())**1.2 * 250 + dist
          });
        }

        async function getName(lat: number, lng: number, isSource: boolean) {
          const name = await getPlaceName(lat, lng)
          if (isSource) {
            setSourcePlaceName(name)
          } else {
            setDestinationPlaceName(name)
            console.log(name)
          }
        }

        // setMouseLocation({x: window.innerWidth / 2, y: window.innerHeight / 2});
        if ( sourceStateRef.current === "selecting") {
          // setCurrState("pinConfirmation");
          setSourceState("confirming")
          getName(coordinates.lat, coordinates.lng, true)
        }
        else {
          // setCurrState("destinationConfirmation");
          setDestState("confirming")
          getName(coordinates.lat, coordinates.lng, false)
        }
        
      } else {
        const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters', 'routes-hitbox','unclustered-point'] });
        if (features.length) {
          const layer = features[0].layer!.id
          console.log(layer)
          if (layer === 'clusters') {
            console.log("in clusters")
            if (features && features[0].properties) {
              console.log("ok like really in clusters")
              const clusterId = features[0].properties.cluster_id;
              const source: mapboxgl.GeoJSONSource = map.current.getSource('pins') as mapboxgl.GeoJSONSource
    
              source
                .getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
                  if (err) return;
                  if (features![0].geometry.type == "Point") {
                    map.current?.easeTo({
                      center: [features![0].geometry.coordinates[0], features![0].geometry.coordinates[1]],
                      zoom: zoom
                    });
                  }
                });
            }
          } else if (layer === "routes-hitbox") {
            
            if (features && features[0].properties) {
              console.log(features[0])

              openMessageMenu(features[0].properties.sender_id, features[0].properties.recipient_id)
            }
          } else if (layer === "unclustered-point") {

            
            if (features && features[0].properties && features[0].geometry.type == "Point") {
              openPinMenu(features[0]);
            }

          }
        }
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