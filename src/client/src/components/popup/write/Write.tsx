import To from "components/popup/write/sections/To"
import From from "components/popup/write/sections/From"
import css from "components/popup/write/Write.module.css";
import { useState, useRef, useEffect } from "react";
import { createRelationshipAndMessage, PinInPrivate } from "api/api";
import { pinCreationState } from "components/App";

type WriteProps = {
  sourcePlaceName: string;
  setSourcePlaceName: (placeName: string) => void;
  destinationPlaceName: string;
  setDestinationPlaceName: (placeName: string) => void;
  // setCurrState: (state: creationState) => void;
  // currState: creationState;

  sourceState: pinCreationState;
  setSourceState: (state: pinCreationState) => void;

  destState: pinCreationState;
  setDestState: (state: pinCreationState) => void;

  senderID: number;
  setSenderID: (id: number) => void;
  recipientID: number;
  setRecipientID: (id: number) => void;
  pins: PinInPrivate[];
}

function Write({ sourcePlaceName, setSourcePlaceName, 
  destinationPlaceName, setDestinationPlaceName,
  sourceState, setSourceState,
  destState, setDestState,
  senderID, setSenderID,
  recipientID, setRecipientID, pins }: WriteProps) {

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

  function startWriting() {
    setWriting(true);
  }

  function reset() {
    setWriting(false);
    setSourceState("inactive");
    setDestState("inactive");
    setMessage("");
  }

  async function submitMessage() {
    await createRelationshipAndMessage({ sender: senderID, recipient: recipientID, message: message });
    setSourceState("inactive");
    setDestState("inactive");
    setMessage("");
    setCreating(false);
    // setCurrState("messageConfirmation");
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
          // setCurrState={setCurrState}
          // currState={currState}

          sourceState={sourceState}
          setSourceState={setSourceState}

          destState={destState}
          setDestState={setDestState}

          destinationPlaceName={destinationPlaceName}
          setDestinationPlaceName={setDestinationPlaceName}
          
          setRecipientID={setRecipientID}
        />

        <From 
          // setCurrState={setCurrState}
          // currState={currState}

          sourceState={sourceState}
          setSourceState={setSourceState}

          destState={destState}
          setDestState={setDestState}

          sourcePlaceName={sourcePlaceName}
          setSourcePlaceName={setSourcePlaceName}

          setSenderID={setSenderID}
          
          pins={pins}
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
        <p style={{ textAlign: "center" }}>Thank you for submitting your note!</p>
        <br/>
        <button onClick={() => setCreating(true)}>Write a new note</button>
      </>
    }
    </>
    
  );
}

export default Write