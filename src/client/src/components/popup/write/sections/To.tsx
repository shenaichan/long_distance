import { creationState } from "components/App"

type ToProps = {
    setCurrState: (state: creationState) => void;
    currState: creationState;
}

function To({ setCurrState, currState }: ToProps) {
    return(
        <>
            <div style={{"display": "flex"}}>
                <p>
                    <b>To:</b>
                </p>
                <button 
                    onClick={() => setCurrState("destinationCreation")}
                    style={{"flex": 1, "margin": "2px"}}>
                    Choose on map
                </button>
                <button style={{"flex": 1, "margin": "2px"}}>
                    Enter friend code
                </button>
            </div>
        </>
    )
}

export default To