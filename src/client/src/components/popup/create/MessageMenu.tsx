import { getSecretReplyLink } from "api/api"
import { useEffect, useState } from "react"
import css from "components/popup/inventory/Inventory.module.css"
import popupCss from "components/popup/Popup.module.css"
import { useAppState } from "state/context"



function MessageMenu () {

    const { highlightedThread, setHighlightedPin, setPinIsHighlighted, setThreadIsHighlighted, pins } = useAppState()
    const [ secretLink, setSecretLink ] = useState<string>("")

    useEffect(() => {
        console.log("opened!")
    }, [])

    useEffect(() => {
        const sender = highlightedThread?.sender
        const matches = pins.filter(myPin => myPin.id === sender!.id)
        if (matches.length > 0) {
            const sender = matches[0]
            async function getLink(sender: number, senderPW: string, recipient: number) {
                const link = await getSecretReplyLink(sender, senderPW, recipient)
                setSecretLink(`${window.location}reply/${link}`)
            }
            getLink(sender.id, sender.private_ownership_token, highlightedThread!.recipient.id)            
        }
    }, [highlightedThread])

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

    function copySecretLink() {
        navigator.clipboard.writeText(secretLink)
            .then(() => {
                alert('Secret reply link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the link. Please try again.');
            });
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

                secretLink !== "" ?
                <>
                <br></br>
                <button onClick={copySecretLink}>Get secret reply link</button>
                </>
                :
                null

            }
            
        </>
    )
}

export default MessageMenu