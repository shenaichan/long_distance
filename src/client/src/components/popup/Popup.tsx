import css from "components/popup/Popup.module.css";
import { ReactNode } from 'react';
import { popupKind } from "types";
import Draggable from 'react-draggable';

type popupProps = {
    title: string, 
    content: ReactNode, 
    reStack: (popup: popupKind) => void, 
    name: popupKind, 
    zIndex: number,
    top: string,
    left: string
}

function Popup({title, content, reStack, name, zIndex, top, left}: popupProps) {

    return (
        <Draggable handle={`.${css.handle}`} onMouseDown={() => {reStack(name)}}>
            <div className={`window ${css.popup}`} style={{zIndex: zIndex, top: top, left: left}}>
                <div className={`title-bar ${css.handle}`}>
                    <div className={`title-bar-text ${css.titleText}`}>
                        {title}
                    </div>
                </div>
                <div className={`window-body ${css.windowBody}`}>
                    {content}
                </div>
            </div>
        </Draggable>
    );

}

export default Popup