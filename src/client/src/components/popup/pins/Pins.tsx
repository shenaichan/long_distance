import css from "components/popup/pins/Pins.module.css";
import { createPin, createApproveClaimPin } from "api/api";
import { useState, useEffect } from "react";

type PinsProps = {
    pinLocation: [number, number];
}

function Pins({pinLocation}: PinsProps) {

    const guideText = ["You don't have any pins yet! Why don't you make one?", 
        "Great, let's get started! This pin will represent you. You can place it \
        anywhere you have a memory of being in a long distance relationship, \
        whether it's where you currently live, or a place you've been in the past. \
        Why don't you navigate to a place you'd like to put your pin, and click there on the map?", 
        "Awesome! You've made a pin at " + pinLocation[0] + ", " + pinLocation[1] + "."];
    
    const guideButtonText = ["Make a pin", "", "Done"];
    
    const [guideIndex, setGuideIndex] = useState(0);

    useEffect(() => {
        if (pinLocation[0] != -200 && pinLocation[1] != -100) {
            setGuideIndex(guideIndex + 1);
        }
    }, [pinLocation]);

    return (
        <>
            <p>
                {guideText[guideIndex]}
            </p>
            
            {
                guideButtonText[guideIndex] === "" ?
                null :  
                <div>
                    <br />
                 <button onClick={() => setGuideIndex(guideIndex + 1)}>
                        {guideButtonText[guideIndex]}
                    </button>
                </div> 
            }

            {/* <br /> */}

            {/* <ul className="tree-view">
                <li>
                    <details>
                    <summary className={css.dropdown}>Sunnyvale, CA, USA</summary>
                    <ul className={css.box}>
                        <li>
                            from Austin, TX, USA
                        </li>
                        <li>
                            to Brooklyn, NY, USA
                        </li>
                </ul>
                    </details>
                </li>
            </ul> */}
        </>
    );
}

export default Pins