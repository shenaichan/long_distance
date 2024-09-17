import css from "components/App.module.css";

import Map from "components/map/Map";
import Popup from "components/popup/Popup";
import Info from "components/popup/info/Info"
import Pins from "components/popup/pins/Pins"
import Favorites from "components/popup/favorites/Favorites"
import Message from "components/popup/message/Message"
import Create from "components/popup/create/Create"
import longdist from "assets/longdist_long.mp3";
import { popupKind } from "types";

import { useState, useEffect, useRef } from "react";

function App() {

  const [stack, setStack] = useState<popupKind[]>(["info", "message", "pins", "favorites"]);
  const [pinLocation, setPinLocation] = useState<[number, number]>([-200, -100]);
  const [mouseLocation, setMouseLocation] = useState<[number, number]>([-1, -1]);
  const [spinLevel, setSpinLevel] = useState<number>(0);
  const [soundLevel, setSoundLevel] = useState<number>(0);
  const [placeName, setPlaceName] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  function reStack(popup: popupKind) {
    let newStack = [...stack]
    let index = newStack.indexOf(popup); 
    newStack.splice(index, 1); 
    newStack.push(popup);
    setStack(newStack);
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundLevel / 10;
    }
  }, [soundLevel]);

  return (
    <div>

      <audio ref={audioRef} 
        src={longdist} 
        loop
        style={{display: "none"}}
      />

      <Map 
        setPinLocation={setPinLocation}
        setMouseLocation={setMouseLocation}
        spinLevel={spinLevel}
        setPlaceName={setPlaceName}
      />

      {
        (mouseLocation[0] != -1 && mouseLocation[1] != -1) ?
        <Popup
          name="creation"
          reStack={reStack}
          title="Confirm location?"
          content={<Create 
            setMouseLocation={setMouseLocation}
            placeName={placeName}
          />}
          zIndex={stack.indexOf("creation") + 1}
          top={`${mouseLocation[1]}px`}
          left={`${mouseLocation[0]}px`}
          creationFlow={true}
        />
        : null
      }

      
      
      <Popup 
        name="info"
        reStack={reStack}
        title="Welcome to Notes From Afar!"
        content={<Info 
          spinLevel={spinLevel}
          setSpinLevel={setSpinLevel}
          soundLevel={soundLevel}
          setSoundLevel={setSoundLevel}
          audioRef={audioRef}
        />}
        zIndex={stack.indexOf("info") + 1}
        top="20px"
        left="20px"
        creationFlow={false}
      />
      {/* <Popup 
        name="message"
        reStack={reStack}
        title="Leave a message"
        content={<Message />}
        zIndex={stack.indexOf("message") + 1}
        top="calc(50vh - 300px)"
        left="calc(50vw - 200px)"
      /> */}
      <Popup 
        name="pins"
        reStack={reStack}
        title="My pins"
        content={ <Pins pinLocation={pinLocation} /> }
        zIndex={stack.indexOf("pins") + 1}
        top="20px"
        left="calc(100vw - 400px - 20px)"
        creationFlow={false}
      />
      <Popup 
        name="favorites"
        reStack={reStack}
        title="My favorites"
        content={ <Favorites /> }
        zIndex={stack.indexOf("favorites") + 1}
        top="50vh"
        left="calc(100vw - 400px - 20px)"
        creationFlow={false}
      />

    </div>
                
  )
}

export default App
