import { useParams } from "react-router-dom"
import Map from "components/map/Map";
import Popup from "components/popup/Popup";
import Info from "components/popup/info/Info"
import Write from "components/popup/write/Write"
import Inventory from "components/popup/inventory/Inventory"
import PinConfirm from "components/popup/create/PinConfirm"
import PinMenu from "components/popup/create/PinMenu"
import longdist from "assets/longdist_long.mp3";
import { PinInPrivate, PinInPublic, getPinByPublicToken } from "api/api";

import { useState, useEffect, useRef, ReactNode } from "react";

export type popupProps = {title: string, content: ReactNode};
export type popupKind = "info" | "pins" | "favorites" | "create" | "write" | "inventory";

export type coordinates = {longitude: number, latitude: number};
export const NO_COORDINATES: coordinates = { longitude: -200, latitude: -100 };

// export type mouseLocation = {x: number, y: number};
// export const NO_MOUSE_LOCATION: mouseLocation = { x: -1, y: -1 };

// export type creationState = 
//     "pinCreation" 
//   | "pinConfirmation" 
//   | "pinMenu" 
//   | "destinationMenu" 
//   | "destinationCreation"
//   | "destinationConfirmation"
//   | "destinationSelection"
//   | "messageCreation" 
//   | "messageConfirmation" 
//   | "none";

export type pinCreationState = 
    "inactive"
  | "selecting"
  | "confirming"
  | "selected";

function App() {

  const [stack, setStack] = useState<popupKind[]>(["info", "write", "inventory"]);
  const [pinLocation, setPinLocation] = useState<coordinates>(NO_COORDINATES);
  // const [mouseLocation, setMouseLocation] = useState<mouseLocation>(NO_MOUSE_LOCATION);
  const [spinLevel, setSpinLevel] = useState<number>(5);
  const [soundLevel, setSoundLevel] = useState<number>(0);
  const [placeName, setPlaceName] = useState<string>("");
  // const [currState, setCurrState] = useState<creationState>("none");
  const [sourcePlaceName, setSourcePlaceName] = useState<string>("");
  const [destinationPlaceName, setDestinationPlaceName] = useState<string>("");
  const [senderID, setSenderID] = useState<number>(-1);
  const [recipientID, setRecipientID] = useState<number>(-1);
  // const [hasReadRules, setHasReadRules] = useState<boolean>(false);
  const [pins, setPins] = useState<PinInPrivate[]>([]);
  const [highlightedPin, setHighlightedPin] = useState<PinInPrivate | PinInPublic | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [ sourceState, setSourceState ] = useState<pinCreationState>("inactive")
  const [ destState, setDestState ] = useState<pinCreationState>("inactive")

  const [ pinIsHighlighted, setPinIsHighlighted ] = useState<boolean>(false)

  const { public_share_token } = useParams();
  console.log("PUBLIC_SHARE_TOKEN", public_share_token );

  function reStack(popup: popupKind) {
    let newStack = [...stack]
    let index = newStack.indexOf(popup); 
    newStack.splice(index, 1); 
    newStack.push(popup);
    setStack(newStack);
  }

  useEffect(() => {
    const myPinsString = localStorage.getItem("pins");
    let myPins: PinInPrivate[] = [];
    if (myPinsString){
      myPins = (JSON.parse(myPinsString) as PinInPrivate[])
      setPins(myPins)
    }

    if (public_share_token) {
      setPinIsHighlighted(true)

      if (myPins){
        const myPin = myPins.filter(pin => pin.public_share_token === public_share_token)[0]
        if (myPin){ 
          setHighlightedPin(myPin)
          return
        }
      }

      const fetchPin = async (public_share_token: string) => {
        const myPin = await getPinByPublicToken(public_share_token);
        setHighlightedPin(myPin); 
      }
      
      fetchPin(public_share_token);
      
    }
  }, []);

  // useEffect(() => {
  //   localStorage.clear()
  // }, []);

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
        // setMouseLocation={setMouseLocation}
        spinLevel={spinLevel}
        setPlaceName={setPlaceName}
        // currState={currState}
        // setCurrState={setCurrState}

        sourceState={sourceState}
        setSourceState={setSourceState}

        destState={destState}
        setDestState={setDestState}

        pinIsHighlighted={pinIsHighlighted}
        setPinIsHighlighted={setPinIsHighlighted}

        highlightedPin={highlightedPin}
        setHighlightedPin={setHighlightedPin}
        pins={pins}
      />

      {
        (sourceState === "confirming" || destState === "confirming") ?
        <Popup
          name="create"
          reStack={reStack}
          title={ sourceState === "confirming" ? "Set your location here?" : "Set your friend's location here?"}
          content={<PinConfirm 
            placeName={placeName}
            // setCurrState={setCurrState}
            // currState={currState}

            setSourceState={setSourceState}
            setDestState={setDestState}

            pinLocation={pinLocation}
            isSource={ sourceState === "confirming" }
            setSourcePlaceName={setSourcePlaceName}
            setDestinationPlaceName={setDestinationPlaceName}
            setSenderID={setSenderID}
            setRecipientID={setRecipientID}
            pins={pins}
            setPins={setPins}
            setHighlightedPin={setHighlightedPin}
          />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
          creationFlow={false}
        />
        : null
      }


      {
        (pinIsHighlighted) ?
        <Popup
          name="create"
          reStack={reStack}
          title={highlightedPin!.place_name}
          content={<PinMenu 
            // setCurrState={setCurrState}
            highlightedPin={highlightedPin}
            setHighlightedPin={setHighlightedPin}
            // setSenderID={setSenderID}
            // setSourcePlaceName={setSourcePlaceName}
            // pinLocation={pinLocation}
          />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
          creationFlow={false}
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
          // hasReadRules={hasReadRules}
          // setHasReadRules={setHasReadRules}
        />}
        zIndex={stack.indexOf("info") + 1}
        top="20px"
        left="20px"
        creationFlow={false}
      />
      
      <Popup 
        name="write"
        reStack={reStack}
        title="Write a note"
        content={ <Write 
          sourcePlaceName={sourcePlaceName}
          destinationPlaceName={destinationPlaceName}
          // setCurrState={setCurrState}
          // currState={currState}

          sourceState={sourceState}
          setSourceState={setSourceState}

          destState={destState}
          setDestState={setDestState}


          senderID={senderID}
          recipientID={recipientID}
          pins={pins}
        /> }
        zIndex={stack.indexOf("write") + 1}
        top="20px"
        left="calc(100vw - 400px - 20px)"
        creationFlow={false}
      />

      <Popup 
        name="inventory"
        reStack={reStack}
        title="My inventory"
        content={ <Inventory
            pins={pins}
            setHighlightedPin={setHighlightedPin}
            // setCurrState={setCurrState}
            setPinIsHighlighted={setPinIsHighlighted}
          /> }
        zIndex={stack.indexOf("inventory") + 1}
        top="50vh"
        left="calc(100vw - 400px - 20px)"
        creationFlow={false}
      />

    </div>
                
  )
}

export default App
