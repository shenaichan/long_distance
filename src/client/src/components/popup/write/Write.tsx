import To from "components/popup/write/sections/To"
import From from "components/popup/write/sections/From"
import css from "components/popup/write/Write.module.css";
import { useState, useRef, useEffect } from "react";
import { createRelationshipAndMessage, createAndAddResponse, checkIfMessageIsSafe, PinInPrivate, 
  createApproveClaimPin, createFriendPin, checkIfRelationshipExists
 } from "api/api";
import { useAppState } from "state/context"



function Write() {

  const { sourcePlaceName, setSourcePlaceName, 
    destinationPlaceName, setDestinationPlaceName,
    sourceLocation, destLocation,
    sourceState, setSourceState,
    destState, setDestState,
    senderID, setSenderID,
    recipientID, setRecipientID, pins, setPins,
    isResponse, setIsResponse, replyPW, highlightedThread } = useAppState()

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
  const [creating, setCreating] = useState<boolean>(true);
  const [secretLink, setSecretLink] = useState<string>("");
  const [reprimand, setReprimand] = useState<boolean>(false);
  const [friendCode, setFriendCode] = useState<string>("");
  const [senderPW, setSenderPW] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resubmissionReprimand, setResubmissionReprimand] = useState<boolean>(false)

  const [ sourceIsExisting, setSourceIsExisting ] = useState<boolean>(false);
  const [ destIsExisting, setDestIsExisting ] = useState<boolean>(false);

  function startWriting() {
    setWriting(true);
  }

  function reset() {
    setReprimand(false);
    setResubmissionReprimand(false);
    setWriting(false);
    setSourceState("inactive");
    setDestState("inactive");
    setMessage("");
  }

  function addPinToStorage(newPin: PinInPrivate) {
    const updatedPins = [...pins, newPin];
    setPins(updatedPins);
    localStorage.setItem("pins", JSON.stringify(updatedPins));
  };

  async function submitMessage() {
    setSubmitting(true);
    const isSafe = await checkIfMessageIsSafe(message)
    if(isSafe){
      if (isResponse) {
        await createAndAddResponse({ sender: senderID, recipient: recipientID, replyPW: replyPW, message: message } );
        addPinToStorage(highlightedThread?.recipient!)
      } else {
        let senderIDLocal = senderID;
        let senderPWLocal = senderPW;
        let recipientIDLocal = recipientID;
        let recipientPWLocal = friendCode;
        if (!sourceIsExisting) {
          let pin = await createApproveClaimPin({latitude: sourceLocation.latitude, longitude: sourceLocation.longitude, place_name: sourcePlaceName});
          setSenderID(pin.id);
          senderIDLocal = pin.id;
          if (pins.filter(myPin => myPin.id === pin.id).length == 0) {
            addPinToStorage(pin);
          }
          setSenderPW(pin.private_ownership_token);
          senderPWLocal = pin.private_ownership_token;
        } 
        if (!destIsExisting) {
          let pin = await createFriendPin({latitude: destLocation.latitude, longitude: destLocation.longitude, place_name: destinationPlaceName});
          setRecipientID(pin.id);
          recipientIDLocal = pin.id;
          setFriendCode(pin.private_allow_mail_token);
          recipientPWLocal = pin.private_allow_mail_token;
        }
        const relationshipExists = await checkIfRelationshipExists(senderIDLocal, recipientIDLocal)
        if (relationshipExists) {
          setResubmissionReprimand(true)
        } else {
          const secretToken = await createRelationshipAndMessage({ sender: senderIDLocal, senderPW: senderPWLocal, recipient: recipientIDLocal, recipientPW: recipientPWLocal, message: message });
          setSecretLink(`localhost:5173/reply/${secretToken}`)
        }
      }
      setCreating(false);
    } else {
      setReprimand(true)
    }
    setSubmitting(false);
  }

  useEffect(() => {
    setReprimand(false)
  }, [message])

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

    }, 4000); // Change text every 4 seconds

    return () => clearInterval(intervalId);
  }, []);


  return (
    <>

    { creating ? 
      <>
        <To
          friendCode={friendCode}
          setFriendCode={setFriendCode}
          setDestIsExisting={setDestIsExisting}
        />

        <From 
          setSenderPW={setSenderPW}
          setSourceIsExisting={setSourceIsExisting}
        />

        <div>
          {
            writing ? (
              <div>
                <textarea className={`window ${css.textEntryBox}`}
                  ref={textEntryRef}
                  style={{ width: "100%", resize: "none" }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>

              </div>
            ) : (
              <div className={`window ${css.textEntryBox}`}
                onClick={startWriting}
                style={{ marginBottom: "5px" }}
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
        </div>

        { reprimand ? 
          <p style={{ textAlign: "center" }}>Sorry, your message was found to be inappropriate, and could not be submitted.</p> : null
        }
        { submitting ? 
          <p style={{ textAlign: "center" }}>Submitting message...</p> : null
        }

        <div style={{display: "flex"}}>

          <button onClick={reset} style={{display: "inline", flex: "1", marginRight: "2px" }}>
            Reset
          </button>
          <button onClick={submitMessage} disabled={ 
              ! ( sourceState === "selected" && destState === "selected" && message.trim() ) 
            }
            style={{display: "inline", flex: "1", marginLeft: "2px" }}>
            Submit!
          </button>

        </div>
      </> 
      :
      <>
        {
          resubmissionReprimand ? 
          <>
            <p style={{ textAlign: "center" }}>Sorry, you can't submit more than one note to the same person.</p>
          </> :
          <>
            <p style={{ textAlign: "center" }}>Thank you for submitting your note!</p>
            { isResponse ? null :
            <>
              <p style={{ textAlign: "center" }}>Want to let your friend write back? Send them the secret link below ;)
              </p>
              <br/>
            </>
            }
          </>
        }
        <br/>
        <div style={{display: "flex"}}>

          {
            (isResponse || resubmissionReprimand) ?
            null : 
            <button onClick={copySecretLink} style={{display: "inline", flex: "1", marginRight: "2px" }}>
              Get secret reply link
            </button>
          }
          <button onClick={() => { setCreating(true); setIsResponse(false); reset(); }} 
            style={{display: "inline", flex: "1", marginLeft: (isResponse || resubmissionReprimand) ? "0px" : "2px" }}>
            Write a new note
          </button>
        </div>
      </>
    }
    </>
    
  );
}

export default Write