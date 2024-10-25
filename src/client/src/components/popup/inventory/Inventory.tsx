import { useState } from "react"
import css from "components/popup/inventory/Inventory.module.css"
import popupCss from "components/popup/Popup.module.css"
import { PinInPrivate, PinInPublic, InventoryMessageIn, MessageIn, getMessageThread } from "api/api"
// import { creationState } from "components/App"
import { useAppState } from "state/context"



function Inventory() {

    const { pins, setHighlightedPin, setPinIsHighlighted, setHighlightedThread, setThreadIsHighlighted, sentNotes, receivedNotes } = useAppState()
    const [tab, setTab] = useState("Sent");

    const getThread = async (sender_id: number, recipient_id: number) => {
        const thread = await getMessageThread(sender_id, recipient_id)
        setHighlightedThread(thread)
        setThreadIsHighlighted(true)
        setPinIsHighlighted(false)
    }
    
    return(
        <>
                <div style={{cursor: "pointer"}}>
                    <menu role="tablist" className={`multirows ${css.tabs}`} >
                        <li role="tab" onClick={() => setTab("Sent")}>
                            <p style={{fontWeight: tab === "Sent" ? "bold" : "normal"}}>
                                Sent
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("Inbox")}>
                            <p style={{fontWeight: tab === "Inbox" ? "bold" : "normal"}}>
                                Inbox
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("My pins")}>
                            <p style={{fontWeight: tab === "My pins" ? "bold" : "normal"}}>
                                My pins
                            </p>
                        </li>
                    </menu>
                </div>
                <div className={`window ${css.info}`} role="tabpanel">
                    <div className="window-body">
                        <h1 style={{fontSize: "16px"}}>{tab}</h1>
                        <ul style={{paddingLeft: "15px"}}>
                            {   
                                tab === "Sent" ?
                                sentNotes.map((note) => (
                                    <li key={note.content}
                                        onClick={() => { getThread(note.sender_id, note.recipient_id) }}
                                        style={{cursor: "pointer"}}
                                    >
                                        <p className={popupCss.truncated}>
                                            {note.content}
                                        </p>
                                    </li>
                                )) : tab === "Inbox" ?
                                receivedNotes.map((note) => (
                                    <li key={note.content}
                                        onClick={() => { getThread(note.sender_id, note.recipient_id) }}
                                        style={{cursor: "pointer"}}
                                    >
                                        <p className={popupCss.truncated}>
                                            {note.content}
                                        </p>
                                    </li>
                                )) :
                                pins.map((pin) => (
                                    <li key={pin.id}
                                        onClick={
                                            () => {
                                                console.log(`go to ${pin.longitude}, ${pin.latitude}`)
                                                setHighlightedPin(pin);
                                                // setCurrState("pinMenu");
                                                setPinIsHighlighted(true);
                                                setThreadIsHighlighted(false);
                                            }
                                        }
                                        style={{cursor: "pointer"}}
                                    >
                                        <p className={popupCss.truncated}>
                                            {pin.place_name}
                                        </p>
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