import { PinInPublic } from "api/api"
import { useEffect } from "react"
import css from "components/popup/inventory/Inventory.module.css"
import popupCss from "components/popup/Popup.module.css"
import { useAppState } from "state/context"



function MessageMenu () {

    const { highlightedThread, setHighlightedPin, setPinIsHighlighted, setThreadIsHighlighted, pins } = useAppState()

    useEffect(() => {
        console.log("opened!")
    }, [])

    function jumpToPin(isSender: boolean) {
        const pin = isSender ? highlightedThread!.sender : highlightedThread!.recipient
        const myPin = pins.filter(myPin => myPin.id === pin.id)[0]
        if (myPin){ 
            setHighlightedPin(myPin)
        } else {
            setHighlightedPin(pin)
        }
        setPinIsHighlighted(true)
        setThreadIsHighlighted(false)
    }

    return (
        <>
            <p className={popupCss.truncated} onClick={() => { jumpToPin(false) }} style={{ cursor: "pointer" }}><b>To:</b> { highlightedThread!.recipient.place_name }</p>
            <p className={popupCss.truncated} onClick={() => { jumpToPin(true) }} style={{ cursor: "pointer" }}><b>From:</b> { highlightedThread!.sender.place_name }</p>
            <br></br>
            <div className={`window ${css.info}`}>
                <p>{ highlightedThread!.message }</p>
            </div>
            {
                highlightedThread!.response ? 
                <>
                    <br></br>
                    <p className={popupCss.truncated} onClick={() => { jumpToPin(true) }} style={{ cursor: "pointer" }}><b>To:</b> { highlightedThread!.sender.place_name }</p>
                    <p className={popupCss.truncated} onClick={() => { jumpToPin(false) }} style={{ cursor: "pointer" }}><b>From:</b> { highlightedThread!.recipient.place_name }</p>
                    <br></br>
                    <div className={`window ${css.info}`}>
                        <p>{ highlightedThread!.response }</p>
                    </div>
                </> :
                null
            }
        </>
    )
}

export default MessageMenu