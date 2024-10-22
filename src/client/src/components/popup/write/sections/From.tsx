import { creationState } from "components/App"
import { useState, useEffect } from "react"
import { PinInPrivate } from "api/api"

type FromProps = {
  setCurrState: (state: creationState) => void;
  currState: creationState;
  pins: PinInPrivate[];
}

function From({ setCurrState, currState, pins }: FromProps) {
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")

  useEffect(() => {
    if (currState === "pinCreation" && pinEntryMode === "map select") {
      setPinEntryMode("neither yet")
    }
  }, [currState])

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
                onClick={() => {setCurrState("destinationCreation"); setPinEntryMode("map select");}}
                style={{ "flex": 1, "margin": "2px" }}>
                Choose on map
              </button>
              <button
                onClick={() => {setPinEntryMode("friend code input")}}
                style={{ "flex": 1, "margin": "2px" }}>
                Pick from your pins
              </button>
            </>
          ) : ( pinEntryMode === "map select" ? 
            <>
              <button
                onClick={() => {setCurrState("none"); setPinEntryMode("neither yet");}}
                style={{ "flex": 1, "margin": "2px" }}>
                Cancel map selection
              </button>
            </> :
            <>
              <select style={{fontSize: "16px", fontFamily: "arial", lineHeight: "1", margin: "4px 2px 2px 2px", width: "calc(100% - 134px)"}}>
                { pins.map( pin => <option
                    style={{overflow: "hidden"}}
                    >{pin.place_name}
                    </option>)}
              </select>
              <button
                onClick={() => {setCurrState("none"); setPinEntryMode("neither yet");}}
                style={{ "margin": "2px" }}>
                Back
              </button>
              <button
                onClick={() => {setCurrState("none"); setPinEntryMode("neither yet");}}
                style={{ "margin": "2px" }}>
                Confirm
              </button>
            </>
          )
        }
        
      </div>
    </>
  )
}

export default From