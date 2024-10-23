import css from "components/popup/Popup.module.css";
import { ReactNode, useState } from 'react';
import { menuKind } from "components/App";
import Draggable from 'react-draggable';

type menuProps = {
    title: string, 
    content: ReactNode, 
    reStack: (menu: menuKind) => void, 
    name: menuKind, 
    zIndex: number,
    top: string,
    left: string,
}

function Menu({title, content, reStack, name, zIndex, top, left}: menuProps) {

    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <Draggable handle={`.${css.handle}`} onMouseDown={() => {reStack(name)}}>
            <div className={`window ${css.popup}`} 
                style={{
                    zIndex: zIndex, 
                    top: top, 
                    left: left, 
                    height: isMinimized ? "36px" : "auto", 
                    resize: (isMinimized) ? "none" : "both"}}>
                <div className={`title-bar ${css.handle}`}>
                    <div className={`title-bar-text ${css.titleText} ${css.truncated}`}>
                        {title}
                    </div>
                    
                        <button className={css.toggleMinimize} 
                            onClick={() => setIsMinimized(!isMinimized)}
                            title={isMinimized ? "Open window" : "Minimize window"}
                        >
                            {isMinimized ? 
                                <div className={css.maximizeIcon}></div> : 
                                <div className={css.minimizeIcon}></div>}
                        </button>

                </div>
            
                <div className={`window-body ${css.windowBody}`}
                    style={{"display": isMinimized ? "none" : "block"}}>
                    {content}
                </div>
                
            </div>
        </Draggable>
    );

}

export default Menu