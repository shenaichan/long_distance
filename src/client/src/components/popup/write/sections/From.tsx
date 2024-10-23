import { pinCreationState } from "components/App"
import { useState, useEffect } from "react"
import { PinInPrivate } from "api/api"
import css from "components/popup/Popup.module.css"

type FromProps = {
  // setCurrState: (state: creationState) => void;
  // currState: creationState;

  sourceState: pinCreationState;
  setSourceState: (state: pinCreationState) => void;

  destState: pinCreationState;
  setDestState: (state: pinCreationState) => void;

  sourcePlaceName: string;

  pins: PinInPrivate[];
}

function From({ sourceState, setSourceState, destState, setDestState, sourcePlaceName, pins }: FromProps) {
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")

  useEffect(() => {
    console.log(destState)
    if ( ( destState === "selecting" || destState === "confirming" ) && pinEntryMode === "map select") {
      setPinEntryMode("neither yet")
      setSourceState("inactive")
    }
  }, [destState])

  useEffect(() => {
    if ( sourceState === "selected" ) {
      setPinEntryMode("finalized")
    } else if ( sourceState === "inactive" ) {
      setPinEntryMode("neither yet")
    }
  }, [sourceState])

  return (
    <>
      <div style={{ "display": "flex" }}>
        <p>
          <b>From:</b>
        </p>
        {
          pinEntryMode === "neither yet" ? (
            <>
              <button
                onClick={() => { setSourceState("selecting"); setPinEntryMode("map select"); }}
                style={{ "flex": 1, "margin": "2px" }}>
                Choose on map
              </button>
              <button
                onClick={() => {setPinEntryMode("pin list")}}
                style={{ "flex": 1, "margin": "2px" }}>
                Pick from your pins
              </button>
            </>
          ) : ( pinEntryMode === "map select" ? 
            <>
              <button
                onClick={() => { setSourceState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "flex": 1, "margin": "2px" }}>
                Cancel map selection
              </button>
            </> : ( pinEntryMode === "pin list" ?
            <>
              <select style={{fontSize: "16px", fontFamily: "arial", lineHeight: "1", margin: "4px 2px 2px 2px", width: "calc(100% - 134px)"}}>
                { pins.map( pin => <option
                    style={{overflow: "hidden"}}
                    >{pin.place_name}
                    </option>)}
              </select>
              <button
                onClick={() => { setSourceState("inactive"); setPinEntryMode("neither yet"); }}
                style={{ "margin": "2px" }}>
                Back
              </button>
              <button
                onClick={() => { setSourceState("selected"); setPinEntryMode("neither yet"); }}
                style={{ "margin": "2px" }}>
                Confirm
              </button>
            </> :
            <>
              <p className={css.truncated} style={{margin: "0px 0px 3px 3px"}}>{sourcePlaceName}</p>
            </> )
          )
        }
        
      </div>
    </>
  )
}

export default From