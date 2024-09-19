import { creationState } from "components/App";
import css from "components/popup/create/PinMenu.module.css";

type PinMenuProps = {
    setCurrState: (state: creationState) => void;
}

function PinMenu({setCurrState}: PinMenuProps) {

    function addNote() {
        setCurrState("destinationMenu");
    }

    return (
        <div>
            <div style={{display: "flex"}}>
                <button className={css.fillButton} onClick={addNote}>Add note</button>
                <button className={css.fillButton}>Get private link</button>
            </div>
            <div style={{display: "flex"}}>
                <button className={css.fillButton}>Get private inbox link</button>
                <button className={css.fillButton}>Delete pin</button>
            </div>
        </div>
    )
}

export default PinMenu;