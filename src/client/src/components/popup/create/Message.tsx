import css from "components/popup/create/Message.module.css";
import { useState, useRef, useEffect } from "react";
import { createRelationshipAndMessage } from "api/api";
import { creationState } from "components/App";

type MessageProps = {
    sourcePlaceName: string;
    destinationPlaceName: string;
    setCurrState: (state: creationState) => void;
    senderID: number;
    recipientID: number;
    hasReadRules: boolean;
}
 
function Message({sourcePlaceName, destinationPlaceName, setCurrState, senderID, recipientID, hasReadRules}: MessageProps) {
    const textEntryRef = useRef<HTMLTextAreaElement>(null);

    const placeholderTexts: string[] = [
        "when I see you again, we should...",
        "today I thought of you when I...",
        "remember that time we...",
        "so excited to see you when...",
        "I wish you were here to...",
        "can't wait to tell you about...",
        "if you were here right now, we'd...",
        "I miss the way we used to...",
        "just imagined your reaction to...",
        "counting down the days until...",
        "you'll never guess what happened...",
        "I found the perfect spot for us to...",
        "been meaning to ask you about...",
        "let's plan our next trip to...",
    ];

    const [writing, setWriting] = useState(false);
    const [textIndex, setTextIndex] = useState(Math.floor(Math.random() * placeholderTexts.length));
    const [message, setMessage] = useState("");

    function startWriting() {
        setWriting(true);
    }

    async function submitMessage() {
        await createRelationshipAndMessage({sender: senderID, recipient: recipientID, message: message});
        setCurrState("messageConfirmation");
    }


    useEffect(() => {
        if (textEntryRef.current) {
            textEntryRef.current.focus();
        }
    }, [writing]);

    useEffect(() => {
        const intervalId = setInterval(() => {

            setTextIndex(prevIndex => {
                let newIndex = Math.floor(Math.random() * placeholderTexts.length);
                if (newIndex !== prevIndex) {
                    console.log("newIndex: ", newIndex);
                    console.log("textIndex: ", prevIndex);
                    return newIndex;
                }
                else {
                    console.log("found same index");
                    return (newIndex + 1) % placeholderTexts.length;
                }
            });

        }, 4000); // Change text every 3 seconds

        return () => clearInterval(intervalId);
    }, []);


    return (
        <>
            <p>
                From: <b><em>{sourcePlaceName}</em></b>
            </p>
            <p>
                To: <b><em>{destinationPlaceName}</em></b>
            </p>
            <br />
            <p>
                {/* TODO: Add link to rules */}
                Please read the rules before submitting your message.
            </p>
            <div>
                {
                    writing ? (
                        <div>
                            <textarea className={`window ${css.textEntryBox}`} 
                            ref={textEntryRef}
                            style={{width: "100%", resize: "none"}}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        
                        </div>
                    ) : (
                        <div className={`window ${css.textEntryBox}`} 
                            onClick={startWriting}
                            style={{marginBottom: "5px"}}
                        >
                        
                            <div className={css.typewriter}
                                key={textIndex}> 
                                <p>
                                {placeholderTexts[textIndex]}
                                </p>
                            </div>

                        </div>

                    )
                }
                <br />
            </div>
            
            {/* <button onClick={submitMessage} disabled={!message.trim() || !hasReadRules}> */}
            <button onClick={submitMessage} disabled={!message.trim()}>
                Submit for review!
            </button>
        </>
    );
}

export default Message