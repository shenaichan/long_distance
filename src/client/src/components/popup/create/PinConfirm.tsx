import css from "components/popup/create/PinMenu.module.css";
import { useAppState } from "state/context"



function PinConfirm() {

    const {placeName, setSourceState, setDestState, sourceState,
        sourcePlaceName, destinationPlaceName } = useAppState()
    
    const isSource = sourceState === "confirming"
        
        // Function to add a new pin

    async function confirmPin() {
        if (isSource) {
            // let pin = await createApproveClaimPin({latitude: pinLocation.latitude, longitude: pinLocation.longitude, place_name: placeName});
            // setSenderID(pin.id);
            // setSourcePlaceName(placeName);
            
            setSourceState("selected");
            // addPinToStorage(pin);
            
        }
        else {
            // let pin = await createApproveClaimPin({latitude: pinLocation.latitude, longitude: pinLocation.longitude, place_name: placeName});
            // setRecipientID(pin.id);
            // setDestinationPlaceName(placeName);
            
            setDestState("selected");
        }
    }

    function cancelPin() {
        if (isSource) {
            // setCurrState("pinCreation");
            setSourceState("selecting");
        }
        else {
            // setCurrState("destinationCreation");
            setDestState("selecting");
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
                Create a new pin representing {isSource ? "you" : "your friend"} at <b>{isSource ? sourcePlaceName : destinationPlaceName}</b>?
            </p>
            <div style={{display: "flex"}}>
                <button className={css.fillButton} onClick={confirmPin}>Yes</button>
                <button className={css.fillButton} onClick={cancelPin}>No</button>
            </div>
        </div>
    )
}

export default PinConfirm;