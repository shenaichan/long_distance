import css from "components/popup/info/Info.module.css"

import About from "components/popup/info/tabs/About"
import Privacy from "components/popup/info/tabs/Privacy"
import Terms from "components/popup/info/tabs/Terms"
import FAQs from "components/popup/info/tabs/FAQs"
import Moderation from "components/popup/info/tabs/Moderation"
import Donate from "components/popup/info/tabs/Donate"
import Contact from "components/popup/info/tabs/Contact"
import Acknowledgements from "components/popup/info/tabs/Acknowledgements"
import { useAppState } from "state/context"

import { getNumKM } from "api/api"

import { useState, useEffect } from "react";

type InfoProps = {
    audioRef: React.RefObject<HTMLAudioElement>;
}

function Info({ audioRef }: InfoProps) {

    const {spinLevel, setSpinLevel, soundLevel, setSoundLevel, numWorldNotes, setRandomNote } = useAppState()

    console.log(audioRef, soundLevel, setSoundLevel) // pleasing the linter

    const [tab, setTab] = useState("About");
    const [numKM, setNumKM] = useState(0);
    const [dateTime, _] = useState(new Date().toLocaleString());

    function randomNote() {
        setRandomNote(Math.floor(Math.random() * numWorldNotes));
    }

    useEffect(() => {
        getNumKM().then((numKM) => {
            setNumKM(numKM);
        });
    }, []);

    return (
        <>
            <p>
                As of <b>{dateTime}</b>, there are <b>{(numKM * 0.621371).toFixed(3)}</b> miles / <b>{numKM.toFixed(3)}</b> kilometers of love in the world.
            </p>
            <br />
                <div style={{cursor: "pointer"}}>
                    <menu role="tablist" className={`multirows ${css.tabs}`} >
                        <li role="tab" onClick={() => setTab("About")}>
                            <p style={{fontWeight: tab === "About" ? "bold" : "normal"}}>
                                About
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("Privacy Policy")}>
                            <p style={{fontWeight: tab === "Privacy Policy" ? "bold" : "normal"}}>
                                Privacy Policy
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("Terms of Use")}>
                            <p style={{fontWeight: tab === "Terms of Use" ? "bold" : "normal"}}>
                                Terms of Use
                            </p>
                        </li>
                        
                    </menu>
                    <menu role="tablist" className={`multirows ${css.tabs}`}>
                        <li role="tab" onClick={() => setTab("Donate")}>
                            <p style={{fontWeight: tab === "Donate" ? "bold" : "normal"}}>
                                Donate
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("FAQs")}>
                            <p style={{fontWeight: tab === "FAQs" ? "bold" : "normal"}}>
                                FAQs
                            </p>
                        </li>
                        <li role="tab" onClick={() => setTab("Acknowledgements")}>
                            <p style={{fontWeight: tab === "Acknowledgements" ? "bold" : "normal"}}>
                                Acknowledgements
                            </p>
                        </li>
                    </menu>
                </div>
                <div className={`window ${css.info}`} role="tabpanel">
                    <div className="window-body">
                        <h1 style={{fontSize: "16px"}}>{tab}</h1>

                        {tab === "About" && <About />}
                        {tab === "Privacy Policy" && <Privacy />}
                        {tab === "Terms of Use" && <Terms />}
                        {tab === "FAQs" && <FAQs />}
                        {tab === "Moderation" && <Moderation/>}
                        {tab === "Donate" && <Donate />}
                        {tab === "Contact" && <Contact />}
                        {tab === "Acknowledgements" && <Acknowledgements />}
                </div>

            </div>
            <br />

            {/* <div className={`field-row ${css.slider}`}>
                <label htmlFor="soundRange"><p>Sound:</p></label>
                <input id="soundRange" 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={soundLevel}
                    onChange={(e) => setSoundLevel(parseInt(e.target.value))}
                    onMouseDown={() => audioRef.current?.play()}
                />
            </div> */}
            <div className={`field-row ${css.slider}`}>
                <label htmlFor="spinRange"><p>Spin:</p></label>
                <input id="spinRange" 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={spinLevel}
                    onChange={(e) => setSpinLevel(parseInt(e.target.value))}
                />
            </div>
            <br />

            <button onClick={randomNote}>Show me a random note</button>
            <br/>
            <p style={{textAlign: "center"}}>Made with &lt;3 by <a href="https://shenaichan.github.io/" target="_blank" rel="noopener noreferrer">Shenai Chan</a> at the <a href="https://www.recurse.com/" target="_blank" rel="noopener noreferrer">Recurse Center</a></p>
        </>
    );
}

export default Info