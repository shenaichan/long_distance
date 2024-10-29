import { pinCreationState } from "components/App"
import { useState, useEffect } from "react"
import { PinInPublic, getPinByFriendCode } from "api/api"
import css from "components/popup/Popup.module.css"
import { useAppState } from "state/context"

type ToProps = {
  friendCode: string
  setFriendCode: (code: string) => void
  setDestIsExisting: (exists: boolean) => void
}

function To({ friendCode, setFriendCode, setDestIsExisting }: ToProps) {
  const { sourceState, setSourceState, destState, setDestState, destinationPlaceName, setDestinationPlaceName, setRecipientID,
    isResponse, sourcePlaceName
  } = useAppState()
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")

  const getFriendPin = async (friendCode: string) => {
    const pin: PinInPublic = await getPinByFriendCode(friendCode)
    if (pin.id === -1) {
      alert('Invalid friend code!');
      setFriendCode("");
    } else {
      setDestIsExisting(true);
      setRecipientID(pin.id);
      setDestinationPlaceName(pin.place_name);
      setDestState("selected"); 
      setPinEntryMode("finalized");
    }
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
      setFriendCode("")
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
                value={friendCode}
                onChange={(e) => { setFriendCode(e.target.value) }}
              ></input>
              <button
                onClick={() => { setDestState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "margin": "2px" }}>
                Back
              </button>
              <button
                onClick={() => { getFriendPin(friendCode); }}
                style={{ "margin": "2px" }}>
                Confirm
              </button>
            </> : 
            <>
               <p className={css.truncated} style={{margin: "0px 0px 3px 3px"}}>{isResponse ? sourcePlaceName : destinationPlaceName}</p>
            </> )
          )
        }
        
      </div>
    </>
  )
}

export default To