import { creationState, coordinates } from "components/App";
import { createPin, createApproveClaimPin } from "api/api";
import css from "components/popup/create/PinMenu.module.css";
import { PinIn } from "api/api";

type PinConfirmProps = {       
    placeName: string;
    setCurrState: (state: creationState) => void;
    currState: creationState;
    pinLocation: coordinates;
    isSource: boolean;
    setSourcePlaceName: (placeName: string) => void;
    setDestinationPlaceName: (placeName: string) => void;
    setSenderID: (id: number) => void;
    setRecipientID: (id: number) => void;
    pins: PinIn[];
    setPins: (pins: PinIn[]) => void;
}

function PinConfirm({placeName, setCurrState, currState, pinLocation, isSource, 
    setSourcePlaceName, setDestinationPlaceName, setSenderID, setRecipientID, 
    pins, setPins}: PinConfirmProps) {

        // Function to add a new pin
    function addPinToStorage(newPin: PinIn) {
        const updatedPins = [...pins, newPin];
        setPins(updatedPins);
        localStorage.setItem("pins", JSON.stringify(updatedPins));
    };

    async function confirmPin() {
        if (isSource) {
            let pin = await createApproveClaimPin({latitude: pinLocation.latitude, longitude: pinLocation.longitude, place_name: placeName});
            setSenderID(pin.id);
            setSourcePlaceName(placeName);
            setCurrState("pinMenu");
            addPinToStorage(pin);
        }
        else {
            let pin = await createPin({latitude: pinLocation.latitude, longitude: pinLocation.longitude, place_name: placeName});
            setRecipientID(pin.id);
            setDestinationPlaceName(placeName);
            setCurrState("messageCreation");
        }
    }

    function cancelPin() {
        if (isSource) {
            setCurrState("pinCreation");
        }
        else {
            setCurrState("destinationCreation");
        }
    }

    return (
        <div>
            <p>
                {
                    placeName === "nowhere in particular" ?
                    "Sorry, we couldn't find a place name for your location. " :
                    ""
                }
                Create a new pin representing {isSource ? "you" : "your friend"} at <b>{placeName}</b>?
            </p>
            <div style={{display: "flex"}}>
                <button className={css.fillButton} onClick={confirmPin}>Yes</button>
                <button className={css.fillButton} onClick={cancelPin}>No</button>
            </div>
        </div>
    )
}

export default PinConfirm;