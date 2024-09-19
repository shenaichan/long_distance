import { creationState } from "components/App";
import css from "components/popup/create/PinMenu.module.css";
import { PinInPrivate, PinInPublic, getRelationshipsStarted, getRelationshipsFinished } from "api/api";
import { useEffect, useState } from "react";

type PinMenuProps = {
    setCurrState: (state: creationState) => void;
    highlightedPin: PinInPrivate | PinInPublic | null;
    setHighlightedPin: (pin: PinInPrivate | PinInPublic | null) => void;
    setSenderID: (id: number) => void;
    setSourcePlaceName: (placeName: string) => void;
}

function PinMenu({setCurrState, highlightedPin, setHighlightedPin, setSenderID, setSourcePlaceName}: PinMenuProps) {
    const [started, setStarted] = useState<PinInPublic[]>([]);
    const [finished, setFinished] = useState<PinInPublic[]>([]);

    function addNote() {
        setCurrState("destinationMenu");
        setSenderID(highlightedPin!.id);
        setSourcePlaceName(highlightedPin!.place_name);
    }

    function getPrivateInboxLink() {
        if (!highlightedPin) return;
        if ("private_allow_mail_token" in highlightedPin) {
        navigator.clipboard.writeText(highlightedPin.private_allow_mail_token)
            .then(() => {
                console.log('Private inbox link copied to clipboard');
                alert('Private inbox link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the link. Please try again.');
            });
        }
    }

    useEffect(() => {
        if (!highlightedPin) return;
    
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
                highlightedPin && "private_allow_mail_token" in highlightedPin ?
                <div>
                    <div style={{display: "flex"}}>
                        <button className={css.fillButton} onClick={addNote}>Add note</button>
                        <button className={css.fillButton}>Get private link</button>
                    </div>
                    <div style={{display: "flex"}}>
                        <button className={css.fillButton} onClick={getPrivateInboxLink}>Get private inbox link</button>
                        <button className={css.fillButton}>Delete pin</button>
                    </div>
                </div>
                : null
            }
 
            <div>
                <p style={{fontWeight: "bold"}}>Sent</p>
                <ul>
                    {started.map(pin => (
                        <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <p style={{fontWeight: "bold"}}>Received</p>   
                <ul>
                    {finished.map(pin => (
                        <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PinMenu;