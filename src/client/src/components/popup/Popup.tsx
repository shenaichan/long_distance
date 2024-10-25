import css from "components/popup/Popup.module.css";
import { ReactNode } from 'react';
import { pinCreationState } from "components/App";
import { useAppState } from "state/context"

type popupProps = {
    title: string, 
    content: ReactNode, 

    zIndex: number,
    top: string,
    left: string,
}

function Popup({title, content, zIndex, top, left, }: popupProps) {

    // const [isMinimized, setIsMinimized] = useState(false);
    const { 
        sourceState, setSourceState,
        destState, setDestState,
        pinIsHighlighted, setPinIsHighlighted, 
        threadIsHighlighted, setThreadIsHighlighted
    } = useAppState()


    function closeWindow() {
        if ( sourceState === "confirming" ) {
            setSourceState("selecting")
        } else if ( destState === "confirming" ) {
            setDestState("selecting")
        } else if ( pinIsHighlighted ) {
            setPinIsHighlighted(false)
        } else if ( threadIsHighlighted ) {
            setThreadIsHighlighted(false)
        }
    }

    return (
        // <Draggable handle={`.${css.handle}`} onMouseDown={() => {reStack(name)}}>
            <div className={`window ${css.popup}`} 
                style={{
                    zIndex: zIndex, 
                    top: top, 
                    left: left, 
                    height: "auto", 
                    resize: "none"}}>
                <div className={ "title-bar" }>
                    <div className={`title-bar-text ${css.titleText} ${css.truncated}`}>
                        {title}
                    </div>
                    <button className={css.toggleMinimize}
                        onClick={ closeWindow }>
                        <p><b>✕</b></p>
                    </button>
                </div>
            
                <div className={`window-body ${css.windowBody}`}>
                    {content}
                </div>
                
            </div>
    );

}

export default Popup