import { MessageIn } from "api/api"
import { useEffect } from "react"
import css from "components/popup/inventory/Inventory.module.css"
import popupCss from "components/popup/Popup.module.css"
import { useAppState } from "state/context"



function MessageMenu () {

    const { highlightedThread } = useAppState()

    useEffect(() => {
        console.log("opened!")
    }, [])
    return (
        <>
            <p className={popupCss.truncated}><b>To:</b> { highlightedThread!.recipient.place_name }</p>
            <p className={popupCss.truncated}><b>From:</b> { highlightedThread!.sender.place_name }</p>
            <br></br>
            <div className={`window ${css.info}`}>
                <p>{ highlightedThread!.message }</p>
            </div>
            {
                highlightedThread!.response ? 
                <>
                    <br></br>
                    <p className={popupCss.truncated}><b>To:</b> { highlightedThread!.sender.place_name }</p>
                    <p className={popupCss.truncated}><b>From:</b> { highlightedThread!.recipient.place_name }</p>
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