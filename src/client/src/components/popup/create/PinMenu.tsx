// import { creationState } from "components/App";
import css from "components/popup/create/PinMenu.module.css";
import popupCss from "components/popup/Popup.module.css"
import { PinInPublic, getRelationshipsStarted, getRelationshipsFinished, getMessageThread } from "api/api";
import { useEffect, useState } from "react";
import { useAppState } from "state/context"

function PinMenu() {

    const { highlightedPin, setHighlightedThread, setThreadIsHighlighted, setPinIsHighlighted } = useAppState()
    const [started, setStarted] = useState<PinInPublic[]>([]);
    const [finished, setFinished] = useState<PinInPublic[]>([]);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const getThread = async (sender_id: number, recipient_id: number) => {
        const thread = await getMessageThread(sender_id, recipient_id)
        setHighlightedThread(thread)
        setThreadIsHighlighted(true)
        setPinIsHighlighted(false)
    }

    function getPrivateInboxLink() {
        if (!highlightedPin) return;
        if ("private_allow_mail_token" in highlightedPin) {
        navigator.clipboard.writeText(highlightedPin.private_allow_mail_token)
            .then(() => {
                alert('Friend code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the link. Please try again.');
            });
        }
    }

    useEffect(() => {
        if (!highlightedPin) return;
        console.log(highlightedPin)
        if ("private_ownership_token" in highlightedPin) {
            setIsPrivate(true)
            console.log("private pin")
        } else {
            setIsPrivate(false)
            console.log("public pin")
        }
    
        const fetchRelationships = async () => {
            const started = await getRelationshipsStarted(highlightedPin.public_share_token);
            const finished = await getRelationshipsFinished(highlightedPin.public_share_token);
            setStarted(started);
            setFinished(finished);
        };
    
        fetchRelationships();
    }, [highlightedPin]);   
    
    return (
        <div>
            {
                isPrivate ?
                <div>
                    <div style={{display: "flex"}}>
                        <button className={css.fillButton} onClick={getPrivateInboxLink}>Get friend code</button>
                        <button className={css.fillButton}>Get editor link</button>
                    </div>
                </div>
                : null
            }
 
            <div>
                <p style={{fontWeight: "bold"}}>Friends</p>

                <div className={`window ${css.info}`}>
                    <div className="window-body">
                        <ul style={{paddingLeft: "15px"}}>
                            {started.map(pin => (
                            // <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                            <li key={pin.id} onClick={() => {if (!highlightedPin) return;
                                getThread(highlightedPin.id, pin.id);}} style={{ cursor: "pointer" }}>
                                <p className={popupCss.truncated}>{pin.place_name}</p>
                            </li>
                        ))}
                        {finished.map(pin => (
                            // <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                            <li key={pin.id} onClick={() => {if (!highlightedPin) return;
                                getThread(pin.id, highlightedPin.id);}} style={{ cursor: "pointer" }}>
                                <p className={popupCss.truncated}>{pin.place_name}</p>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PinMenu;