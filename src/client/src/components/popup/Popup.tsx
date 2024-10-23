import css from "components/popup/Popup.module.css";
import { ReactNode, useState } from 'react';
import { popupKind } from "components/App";
import Draggable from 'react-draggable';

type popupProps = {
    title: string, 
    content: ReactNode, 
    reStack: (popup: popupKind) => void, 
    name: popupKind, 
    zIndex: number,
    top: string,
    left: string,
    creationFlow: boolean
}

function Popup({title, content, reStack, name, zIndex, top, left, creationFlow}: popupProps) {

    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <Draggable handle={`.${css.handle}`} onMouseDown={() => {reStack(name)}}>
            <div className={`window ${css.popup}`} 
                style={{
                    zIndex: zIndex, 
                    top: top, 
                    left: left, 
                    height: isMinimized ? "36px" : "auto", 
                    resize: (isMinimized || creationFlow) ? "none" : "both"}}>
                <div className={creationFlow ? "title-bar" : `title-bar ${css.handle}`}>
                    <div className={`title-bar-text ${css.titleText} ${css.truncated}`}>
                        {title}
                    </div>
                    {
                        creationFlow ?
                        null :
                            <button className={css.toggleMinimize} 
                                onClick={() => setIsMinimized(!isMinimized)}
                                title={isMinimized ? "Open window" : "Minimize window"}
                            >
                                {isMinimized ? 
                                    <div className={css.maximizeIcon}></div> : 
                                    <div className={css.minimizeIcon}></div>}
                            </button>

                    }
                </div>
            
                <div className={`window-body ${css.windowBody}`}
                    style={{"display": isMinimized ? "none" : "block"}}>
                    {content}
                </div>
                
            </div>
        </Draggable>
    );

}

export default Popup