import { creationState } from "components/App";
import css from "components/popup/create/PinMenu.module.css";

type DestinationMenuProps = {
    setCurrState: (state: creationState) => void;
}

function DestinationMenu({setCurrState}: DestinationMenuProps) {
    return (
        <div style={{display: "flex"}}>
            <button className={css.fillButton} onClick={() => setCurrState("destinationCreation")}>Create new pin</button>
            <button className={css.fillButton} onClick={() => setCurrState("destinationSelection")}>Write to existing pin</button>
        </div>
    )
}

export default DestinationMenu;