import { useParams } from "react-router-dom"
import Map from "components/map/Map";
import Popup from "components/popup/Popup";
import Menu from "components/popup/Menu";
import Info from "components/popup/info/Info"
import Write from "components/popup/write/Write"
import Inventory from "components/popup/inventory/Inventory"
import PinConfirm from "components/popup/create/PinConfirm"
import PinMenu from "components/popup/create/PinMenu"
import MessageMenu from "components/popup/create/MessageMenu"
import longdist from "assets/longdist_long.mp3";
import { PinInPrivate, PinInPublic, getPinByPublicToken, getAllMyMessageThreads, MessageIn, InventoryMessageIn } from "api/api";

import { useState, useEffect, useRef, ReactNode } from "react";

export type popupProps = {title: string, content: ReactNode};
export type menuKind = "info" | "pins" | "favorites" | "create" | "write" | "inventory";

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

  const [stack, setStack] = useState<menuKind[]>(["info", "write", "inventory"]);
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
  const [sentNotes, setSentNotes] = useState<InventoryMessageIn[]>([]);
  const [receivedNotes, setReceivedNotes] = useState<InventoryMessageIn[]>([]);
  const [highlightedPin, setHighlightedPin] = useState<PinInPrivate | PinInPublic | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [ sourceState, setSourceState ] = useState<pinCreationState>("inactive")
  const [ destState, setDestState ] = useState<pinCreationState>("inactive")

  const [ pinIsHighlighted, setPinIsHighlighted ] = useState<boolean>(false)

  const [ threadIsHighlighted, setThreadIsHighlighted ] = useState<boolean>(false)
  const [ highlightedThread, setHighlightedThread ] = useState< MessageIn | null >(null)

  const { public_share_token } = useParams();
  console.log("PUBLIC_SHARE_TOKEN", public_share_token );

  function reStack(menu: menuKind) {
    let newStack = [...stack]
    let index = newStack.indexOf(menu); 
    newStack.splice(index, 1); 
    newStack.push(menu);
    setStack(newStack);
  }

  const getAllNotes = async (pinIds: number[]) => {
    const myNotes = await getAllMyMessageThreads(pinIds)
    console.log(myNotes)
    setSentNotes(myNotes[0])
    setReceivedNotes(myNotes[1])
  }

  useEffect(() => {
    const myPinsString = localStorage.getItem("pins");
    let myPins: PinInPrivate[] = [];
    if (myPinsString){
      myPins = (JSON.parse(myPinsString) as PinInPrivate[])
      setPins(myPins)
      const pinIds = myPins.map(pin => pin.id)
      getAllNotes(pinIds)
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
        (threadIsHighlighted) ? 
        <Popup
          title="A note from afar..."
          content={<MessageMenu 
            highlightedThread={highlightedThread!}
          />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
          sourceState={sourceState}
          setSourceState={setSourceState}
          destState={destState}
          setDestState={setDestState}
          pinIsHighlighted={pinIsHighlighted}
          setPinIsHighlighted={setPinIsHighlighted}
          threadIsHighlighted={threadIsHighlighted}
          setThreadIsHighlighted={setThreadIsHighlighted}
        />
         :
        null
      }

      {
        (sourceState === "confirming" || destState === "confirming") ?
        <Popup
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
          sourceState={sourceState}
          setSourceState={setSourceState}
          destState={destState}
          setDestState={setDestState}
          pinIsHighlighted={pinIsHighlighted}
          setPinIsHighlighted={setPinIsHighlighted}
          threadIsHighlighted={threadIsHighlighted}
          setThreadIsHighlighted={setThreadIsHighlighted}
        />
        : null
      }


      {
        (pinIsHighlighted) ?
        <Popup
          title={highlightedPin!.place_name}
          content={<PinMenu 
            highlightedPin={highlightedPin}
            setHighlightedPin={setHighlightedPin}
            setPinIsHighlighted={setPinIsHighlighted}
            setHighlightedThread={setHighlightedThread}
            setThreadIsHighlighted={setThreadIsHighlighted}
          />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
          sourceState={sourceState}
          setSourceState={setSourceState}
          destState={destState}
          setDestState={setDestState}
          pinIsHighlighted={pinIsHighlighted}
          setPinIsHighlighted={setPinIsHighlighted}
          threadIsHighlighted={threadIsHighlighted}
          setThreadIsHighlighted={setThreadIsHighlighted}
        />
        : null
      }

      <Menu 
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
      />
      
      <Menu 
        name="write"
        reStack={reStack}
        title="Write a note"
        content={ <Write 
          sourcePlaceName={sourcePlaceName}
          setSourcePlaceName={setSourcePlaceName}
          destinationPlaceName={destinationPlaceName}
          setDestinationPlaceName={setDestinationPlaceName}
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
      />

      <Menu 
        name="inventory"
        reStack={reStack}
        title="My inventory"
        content={ <Inventory
            pins={pins}
            setHighlightedPin={setHighlightedPin}
            // setCurrState={setCurrState}
            setPinIsHighlighted={setPinIsHighlighted}
            setHighlightedThread={setHighlightedThread}
            setThreadIsHighlighted={setThreadIsHighlighted}
            sentNotes={sentNotes}
            receivedNotes={receivedNotes}
          /> }
        zIndex={stack.indexOf("inventory") + 1}
        top="50vh"
        left="calc(100vw - 400px - 20px)"
      />

    </div>
                
  )
}

export default App
