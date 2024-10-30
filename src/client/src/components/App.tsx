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
import { PinInPrivate, getPinByPublicToken, getAllMyMessageThreads, 
  MessageInPrivate, canWriteResponse, getMessageThreadBySecret, checkIfGeolocateAllowed, 
  getPinByPrivateToken } from "api/api";
import { useAppState } from "state/context"
import { useNavigate } from 'react-router-dom';

import { useState, useEffect, useRef, ReactNode } from "react";

export type popupProps = {title: string, content: ReactNode};
export type menuKind = "info" | "pins" | "favorites" | "create" | "write" | "inventory";

export type coordinates = {longitude: number, latitude: number};
export const NO_COORDINATES: coordinates = { longitude: -200, latitude: -100 };

export type pinCreationState = 
    "inactive"
  | "selecting"
  | "confirming"
  | "selected";

const MAX_NUM_NOTES = 100;

function App() {

  const navigate = useNavigate()

  const {
      stack,
      setStack,
      soundLevel,
      setSourcePlaceName,
      setDestinationPlaceName,
      setSenderID,
      setRecipientID,
      pins,
      setPins,
      setSentNotes,
      setReceivedNotes,
      highlightedPin,
      setHighlightedPin,
      sourceState,
      setSourceState,
      destState,
      setDestState,
      pinIsHighlighted,
      setPinIsHighlighted,
      threadIsHighlighted,
      setThreadIsHighlighted,
      setHighlightedThread,
      setIsResponse,
      setReplyPW,
  } = useAppState()

  const [writeEnable, setWriteEnable] = useState<boolean>(true);
  const [geolocateEnable, setGeolocateEnable] = useState<boolean>(false);
  const [pinClaimed, setPinClaimed] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const { public_share_token, secret_reply_token, secret_ownership_token } = useParams();

  function reStack(menu: menuKind) {
    let newStack = [...stack]
    let index = newStack.indexOf(menu); 
    newStack.splice(index, 1); 
    newStack.push(menu);
    setStack(newStack);
  }

  const getAllNotes = async (myPins: PinInPrivate[]) => {
    const pinIds = myPins.map(pin => pin.id)
    const myNotes = await getAllMyMessageThreads(pinIds)
    console.log(myNotes)
    setSentNotes(myNotes[0])
    if (myNotes[0].length >= MAX_NUM_NOTES) {
      setWriteEnable(false)
    }
    setReceivedNotes(myNotes[1])
  }

  useEffect(() => {
    if (!secret_ownership_token) {
      setPinClaimed(true);
      return;
    }
    async function getClaimedPin() {
      const claimedPin = await getPinByPrivateToken(secret_ownership_token as string)
      const myPinsString = localStorage.getItem("pins")
      if (!myPinsString) {
        getAllNotes([claimedPin])
        setPins([claimedPin])
        setPinClaimed(true)
      } else if (pins.length > 0 && pins.map(myPin => myPin.id === claimedPin.id).length === 0) {
        const newPins = [...pins, claimedPin]
        getAllNotes(newPins)
        setPins(newPins)
        setPinClaimed(true)
      }
      
    }
    if (!pinClaimed) {
      getClaimedPin()
    }
  }, [pins])

  useEffect(() => {
    async function canGeolocate() {
      const geolocatePerms = await checkIfGeolocateAllowed()
      setGeolocateEnable(geolocatePerms)
    }
    canGeolocate()
    const myPinsString = localStorage.getItem("pins");
    let myPins: PinInPrivate[] = [];
    if (myPinsString){
      myPins = (JSON.parse(myPinsString) as PinInPrivate[])
      console.log(myPins)
      setPins(myPins)
      getAllNotes(myPins)
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

    if (secret_reply_token) {
      async function canReply() {
        const legal = await canWriteResponse(secret_reply_token as string)
        if (legal) {
          async function fetchThread() {
            const thread: MessageInPrivate =  await getMessageThreadBySecret(secret_reply_token as string)
            setSenderID(thread.sender.id)
            setRecipientID(thread.recipient.id)
            setSourcePlaceName(thread.sender.place_name)
            setDestinationPlaceName(thread.recipient.place_name)
            setSourceState("selected")
            setDestState("selected")
            setIsResponse(true)
            setReplyPW(secret_reply_token as string)
            setHighlightedThread(thread)
            setThreadIsHighlighted(true)
          }
          fetchThread()
        } else {
          alert("Already used this link to reply!")
        }
      }
    canReply()
    }
    navigate("/")
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

      <Map />

      {
        (threadIsHighlighted) ? 
        <Popup
          title="A note from afar..."
          content={<MessageMenu />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
        />
         :
        null
      }

      {
        (sourceState === "confirming" || destState === "confirming") ?
        <>
        <Popup
          title={ sourceState === "confirming" ? "Set your location here?" : "Set your friend's location here?"}
          content={<PinConfirm />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
        />
        </>
        : null
      }


      {
        (pinIsHighlighted) ?
        <Popup
          title={highlightedPin!.place_name}
          content={<PinMenu />}
          zIndex={stack.length + 1}
          top={"20px"}
          left={"calc(50vw - 200px)"}
        />
        : null
      }

      <Menu 
        name="info"
        reStack={reStack}
        title="Welcome to Notes From Afar!"
        content={<Info 
          audioRef={audioRef}
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
          writeEnable={writeEnable}
          geolocateEnable={geolocateEnable}
        /> }
        zIndex={stack.indexOf("write") + 1}
        top="20px"
        left="calc(100vw - 400px - 20px)"
      />

      <Menu 
        name="inventory"
        reStack={reStack}
        title="My inventory"
        content={ <Inventory /> }
        zIndex={stack.indexOf("inventory") + 1}
        top="50vh"
        left="calc(100vw - 400px - 20px)"
      />

    </div>
                
  )
}

export default App
