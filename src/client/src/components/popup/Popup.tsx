import css from "components/popup/Popup.module.css";
import {ReactNode} from 'react';

type popupProps = {title: string, content: ReactNode}

function Popup({title, content}: popupProps) {

    return (
        <div className={`window ${css.popup}`}>
            <div className="title-bar">
                <div className={`title-bar-text ${css.windowTitle}`}>
                    {title}
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" className={css.controls}>
                        <div className={css.minimize}></div>
                    </button>
                    <button aria-label="Maximize" className={css.controls}>
                        <div className={css.maximize}></div>
                    </button>
                </div>
            </div>
            <div className={`window-body ${css.windowBody}`}>
                {content}
            </div>
        </div>
        
    );

}

export default Popup