// import { creationState } from "components/App";
import css from "components/popup/create/PinMenu.module.css";
import { PinInPrivate, PinInPublic, getRelationshipsStarted, getRelationshipsFinished, getMessageThread, MessageIn } from "api/api";
import { useEffect, useState } from "react";

type PinMenuProps = {
    // setCurrState: (state: creationState) => void;
    highlightedPin: PinInPrivate | PinInPublic | null;
    setHighlightedPin: (pin: PinInPrivate | PinInPublic | null) => void;

    setPinIsHighlighted: (pinState: boolean) => void;

    setHighlightedThread: (thread: MessageIn) => void;
    setThreadIsHighlighted: (threadState: boolean) => void;
    // setSenderID: (id: number) => void;
    // setSourcePlaceName: (placeName: string) => void;
}

function PinMenu({ highlightedPin, setHighlightedPin, setHighlightedThread, setThreadIsHighlighted, setPinIsHighlighted }: PinMenuProps) {
    const [started, setStarted] = useState<PinInPublic[]>([]);
    const [finished, setFinished] = useState<PinInPublic[]>([]);

    const getThread = async (sender_id: number, recipient_id: number) => {
        const thread = await getMessageThread(sender_id, recipient_id)
        setHighlightedThread(thread)
        setThreadIsHighlighted(true)
        setPinIsHighlighted(false)
    }

    // function addNote() {
    //     setCurrState("destinationMenu");
    //     setSenderID(highlightedPin!.id);
    //     setSourcePlaceName(highlightedPin!.place_name);
    // }

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
                        <button className={css.fillButton} onClick={getPrivateInboxLink}>Get friend code</button>
                        <button className={css.fillButton}>Get editor link</button>
                    </div>
                </div>
                : null
            }
 
            <div>
                <p style={{fontWeight: "bold"}}>Sent</p>
                <ul>
                    {started.map(pin => (
                        // <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                        <li key={pin.id} onClick={() => {if (!highlightedPin) return;
                            getThread(highlightedPin.id, pin.id);}}>{pin.place_name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <p style={{fontWeight: "bold"}}>Received</p>   
                <ul>
                    {finished.map(pin => (
                        // <li key={pin.id} onClick={() => setHighlightedPin(pin)}>{pin.place_name}</li>
                        <li key={pin.id} onClick={() => {if (!highlightedPin) return;
                            getThread(pin.id, highlightedPin.id);}}>{pin.place_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PinMenu;