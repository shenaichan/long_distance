import { pinCreationState } from "components/App"
import { useState, useEffect } from "react"
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
}

function To({ sourceState, setSourceState, destState, setDestState, destinationPlaceName, setDestinationPlaceName}: ToProps) {
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")

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
              ></input>
              <button
                onClick={() => { setDestState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "margin": "2px" }}>
                Back
              </button>
              <button
                onClick={() => { setDestState("selected"); setPinEntryMode("neither yet"); }}
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