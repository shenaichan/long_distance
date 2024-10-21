import { creationState } from "components/App"

type FromProps = {
    setCurrState: (state: creationState) => void;
    currState: creationState;
}

function From({ setCurrState, currState }: FromProps) {
    return(
        <>
            <div style={{"display": "flex"}}>
                <p>
                    <b>From:</b>
                </p>
                <button 
                    onClick={() => setCurrState("pinCreation")}
                    style={{"flex": 1, "margin": "2px"}}>
                    Choose on map
                </button>
                <button style={{"flex": 1, "margin": "2px"}}>
                    Pick from your pins
                </button>
            </div>
        </>
    )
}

export default From