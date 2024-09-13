import "98.css";
import css from "components/popup/Popup.module.css";


function Popup() {

    return (
        <div className="window" 
             style={{margin: "20px",
                     pointerEvents: "all", 
                     width: "400px",
                     zIndex: 1,
                     backgroundColor: "#efefef"}}>
            <div className="title-bar">
                <div className="title-bar-text"
                     style={{fontSize: "16px"}}>
                    Welcome to Notes From Afar!
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div className="window-body"
                 style={{fontSize: "12px", fontFamily: "monospace"}}>
                As of today, 2024-09-13, there are <b>495,213</b> miles of love in the world.
            </div>
        </div>
        
    );

}

export default Popup