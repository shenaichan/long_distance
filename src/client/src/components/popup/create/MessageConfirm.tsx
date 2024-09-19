import { useState, useEffect } from "react";
import { creationState } from "components/App";

type MessageConfirmProps = {
    setCurrState: (state: creationState) => void;
}

function MessageConfirm({ setCurrState }: MessageConfirmProps) {
    

    const [buttonText, setButtonText] = useState("Close");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (email) {
            setButtonText("Submit email and close");
        }
        else {
            setButtonText("Close");
        }
    }, [email]);

    function handleSubmit() {
        if (email) {
            // submit email
        }
        else {
            // close popup
        }
        setCurrState("none");
    }


    return (
        <div>
            <p>
                Your message has been submitted for review!
            </p>
            <br />
            <p>
                If you would like to receive an email when your note has been reviewed, enter your email below:
            </p>
            <br />
            <input type="email" placeholder="me@email.com" 
                style={{
                    fontSize: "14px",
                    padding: "5px",
                    marginBottom: "10px",
                    width: "100%",
                }}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubmit}>{buttonText}</button>
        </div>
    )
}

export default MessageConfirm;
