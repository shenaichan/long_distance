import css from "components/popup/pins/Pins.module.css";
import { createPin, createApproveClaimPin } from "api/api";
import { useState, useEffect } from "react";
import { coordinates, NO_COORDINATES, creationState } from "components/App";
import { PinInPrivate, PinInPublic } from "api/api";

type PinsProps = {
    placeName: string;
    currState: creationState;
    setCurrState: (state: creationState) => void;
    pins: PinInPrivate[];
    setPins: (pins: PinInPrivate[]) => void;
    setHighlightedPin: (pin: PinInPrivate | PinInPublic | null) => void;
}

function Pins({placeName, currState, setCurrState, pins, setPins, setHighlightedPin}: PinsProps) {

    const [guideText, setGuideText] = useState("You don't have any pins yet! Why don't you make one?"); 
    const [guideButtonText, setGuideButtonText] = useState("Make a pin!");

    useEffect(() => {
        // Load pins from localStorage when component mounts
        const storedPins = localStorage.getItem("pins");
        if (storedPins) {
            setPins(JSON.parse(storedPins));
        }
    }, []);

    useEffect(() => {
        if (currState !== "pinCreation" && currState !== "pinConfirmation") {
            if (pins.length > 0) {
                setGuideText("You've made " + pins.length + "/10 pins!");
                setGuideButtonText("Make another pin!");
            }
            else {
                setGuideText("You don't have any pins yet! Why don't you make one?");
                setGuideButtonText("Make a pin!");
            }
           
        }
    }, [currState, pins]);

    function toggleCreatePin() {
        if (currState !== "pinCreation" && currState !== "pinConfirmation") {
            setCurrState("pinCreation");
            setGuideButtonText("Cancel pin creation...");
        } else {
            setCurrState("none");
            if (localStorage.getItem("pins")) {
                setGuideButtonText("Make another pin!");
            }
            else {
                setGuideButtonText("Make a pin!");
            }
        }
    }

    return (
        <>
            <p>
                {guideText}
            </p>

                <div>
                    <br />
                 <button onClick={toggleCreatePin}>
                        {guideButtonText}
                    </button>
                </div> 


            
            {
                pins.length > 0 ?
                <>
                    <br />
                    <ul className="tree-view">
                        {pins.map((pin) => (
                            <li key={pin.id} 
                                onClick={() => {
                                    setHighlightedPin(pin);   
                                    setCurrState("pinMenu");
                                }} 
                                style={{cursor: "pointer"}}
                            >
                                {pin.place_name}
                            </li>
                        ))}
                    </ul>
                </>
                : null
            }
        </>
    );
}

export default Pins