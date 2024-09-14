import "98.css";
import css from "components/popup/Popup.module.css";
import {ReactNode} from 'react';

type popupProps = {title: string, content: ReactNode}

function Popup({title, content}: popupProps) {

    return (
        <div className="window" 
             style={{margin: "20px",
                     pointerEvents: "all", 
                     width: "400px",
                     zIndex: 1,
                     backgroundColor: "#efffef"}}>
            <div className="title-bar">
                <div className="title-bar-text"
                     style={{fontSize: "16px"}}>
                    {title}
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div className="window-body"
                 style={{fontSize: "12px", fontFamily: "monospace"}}>
                {content}
            </div>
        </div>
        
    );

}

export default Popup