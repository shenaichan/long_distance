import { pinCreationState } from "components/App"
import { useState, useEffect } from "react"
import { PinInPublic, getPinByFriendCode } from "api/api"
import css from "components/popup/Popup.module.css"

type ToProps = {
  // setCurrState: (state: creationState) => void;
  // currState: creationState;

  sourceState: pinCreationState;
  setSourceState: (state: pinCreationState) => void;

  destState: pinCreationState;
  setDestState: (state: pinCreationState) => void;

  destinationPlaceName: string;
  setDestinationPlaceName: (placeName: string) => void;

  setRecipientID: (id: number) => void;
}

function To({ sourceState, setSourceState, destState, setDestState, destinationPlaceName, setDestinationPlaceName, setRecipientID}: ToProps) {
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")
  const [ friendCode, setFriendCode ] = useState("")

  const getFriendPin = async (friendCode: string) => {
    const pin: PinInPublic = await getPinByFriendCode(friendCode)
    setRecipientID(pin.id);
    setDestinationPlaceName(pin.place_name);
  }

  useEffect(() => {
    if ( ( sourceState === "selecting" || sourceState === "confirming" ) && pinEntryMode === "map select") {
      setPinEntryMode("neither yet")
      setDestState("inactive")
    }
  }, [sourceState])

  useEffect(() => {
    if ( destState === "selected" ) {
      setPinEntryMode("finalized")
    } else if ( destState === "inactive" ) {
      setPinEntryMode("neither yet")
    }
  }, [destState])

  return (
    <>
      <div style={{ "display": "flex" }}>
        <p>
          <b>To:</b>
        </p>
        {
          pinEntryMode === "neither yet" ? (
            <>
              <button
                onClick={() => { setDestState("selecting"); setPinEntryMode("map select"); }}
                style={{ "flex": 1, "margin": "2px" }}>
                Choose on map
              </button>
              <button
                onClick={() => {setPinEntryMode("friend code input")}}
                style={{ "flex": 1, "margin": "2px" }}>
                Enter friend code
              </button>
            </>
          ) : ( pinEntryMode === "map select" ? 
            <>
              <button
                onClick={() => { setDestState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "flex": 1, "margin": "2px" }}>
                Cancel map selection
              </button>
            </> : (pinEntryMode === "friend code input" ?
            <>
              <input 
                placeholder="Enter friend code"
                style={{ "flex": 1, "margin": "2px", "fontFamily": "arial", "fontSize": "16px", "lineHeight": "1", "padding": "0px" }}
                onChange={(e) => { setFriendCode(e.target.value) }}
              ></input>
              <button
                onClick={() => { setDestState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "margin": "2px" }}>
                Back
              </button>
              <button
                onClick={() => { getFriendPin(friendCode); setDestState("selected"); setPinEntryMode("finalized"); }}
                style={{ "margin": "2px" }}>
                Confirm
              </button>
            </> : 
            <>
               <p className={css.truncated} style={{margin: "0px 0px 3px 3px"}}>{destinationPlaceName}</p>
            </> )
          )
        }
        
      </div>
    </>
  )
}

export default To