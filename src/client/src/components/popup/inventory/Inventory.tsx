import { useState, useEffect } from "react"
import css from "components/popup/inventory/Inventory.module.css"
import { PinInPrivate, PinInPublic } from "api/api"
import { creationState } from "components/App"

type InventoryProps = {
    pins: PinInPrivate[]
    setHighlightedPin: (pin: PinInPrivate | PinInPublic | null) => void
    setCurrState: (state: creationState) => void
}

function Inventory({ pins, setHighlightedPin, setCurrState }: InventoryProps) {
    const [tab, setTab] = useState("My notes");
    
    return(
        <>
                <div style={{cursor: "pointer"}}>
                    <menu role="tablist" className={`multirows ${css.tabs}`} >
                        <li role="tab" onClick={() => setTab("My notes")}>
                            <p style={{fontWeight: tab === "My notes" ? "bold" : "normal"}}>
                                My notes
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("My pins")}>
                            <p style={{fontWeight: tab === "My pins" ? "bold" : "normal"}}>
                                My pins
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("My favorites")}>
                            <p style={{fontWeight: tab === "My favorites" ? "bold" : "normal"}}>
                                My favorites
                            </p>
                        </li>
                    </menu>
                </div>
                <div className={`window ${css.info}`} role="tabpanel">
                    <div className="window-body">
                        <h1 style={{fontSize: "16px"}}>{tab}</h1>
                        <ul style={{paddingLeft: "5px"}}>
                            {
                                pins.map((pin) => (
                                    <li key={pin.id}
                                        onClick={
                                            () => {
                                                setHighlightedPin(pin);
                                                setCurrState("pinMenu");
                                            }
                                        }
                                        style={{cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                                    >
                                        {pin.place_name}
                                    </li>
                                ))
                            }
                        </ul>
                </div>

            </div>
        </>
    )
}

export default Inventory