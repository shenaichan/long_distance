import { creationState } from "components/App"
import { useState, useEffect } from "react"

type ToProps = {
  setCurrState: (state: creationState) => void;
  currState: creationState;
}

function To({ setCurrState, currState }: ToProps) {
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
          <b>To:</b>
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
                Enter friend code
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
              <input 
                placeholder="Enter friend code"
                style={{ "flex": 1, "margin": "2px", "fontFamily": "arial", "fontSize": "16px", "lineHeight": "1", "padding": "0px" }}
              ></input>
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

export default To