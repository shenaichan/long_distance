import { useState, useEffect } from "react"
import css from "components/popup/Popup.module.css"
import { useAppState } from "state/context"

type FromProps = {
  setSenderPW: (pw: string) => void;
  setSourceIsExisting: (exists: boolean) => void;
  geolocateEnable: boolean
}

function From({ setSenderPW, setSourceIsExisting, geolocateEnable }: FromProps) {
  const { sourceState, setSourceState, destState, sourcePlaceName, setSourcePlaceName, setSenderID, pins,
    destinationPlaceName, isResponse
   } = useAppState()
  const [pinEntryMode, setPinEntryMode] = useState("neither yet")

  useEffect(() => {
    if (pins.length > 0 && pinEntryMode === "pin list") {
      setSourcePlaceName(pins[0].place_name);
      setSenderID(pins[0].id);
      setSenderPW(pins[0].private_ownership_token)
    }
  }, [pinEntryMode])

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
              {geolocateEnable ?
                <button
                  onClick={() => { setSourceState("selecting"); setPinEntryMode("map select"); }}
                  style={{ "flex": 1, "margin": "2px" }}>
                  Choose on map
                </button>
              :
                null}
              {
                pins.length > 0 ?

                <button
                  onClick={() => {setPinEntryMode("pin list")}}
                  style={{ "flex": 1, "margin": geolocateEnable ? "2px" : "0px" }}>
                  Pick from your pins
                </button> :
                null

              }
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
              <select style={{fontSize: "16px", fontFamily: "arial", lineHeight: "1", margin: "4px 2px 2px 2px", width: "calc(100% - 134px)"}}
                onChange={(e) => {setSourcePlaceName(e.target.value); setSenderID(pins[e.target.options.selectedIndex].id); setSenderPW(pins[e.target.options.selectedIndex].private_ownership_token);}}
              >
                { pins.map( pin => <option
                    key={pin.id}
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
                onClick={() => { setSourceState("selected"); setPinEntryMode("neither yet"); setSourceIsExisting(true);}}
                style={{ "margin": "2px" }}>
                Confirm
              </button>
            </> :
            <>
              <p className={css.truncated} style={{margin: "0px 0px 3px 3px"}}>{ isResponse ? destinationPlaceName : sourcePlaceName}</p>
            </> )
          )
        }
        
      </div>
    </>
  )
}

export default From