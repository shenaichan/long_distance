import css from "components/popup/Popup.module.css";
import "98.css";

function Popup() {

    return (
        // <div className={css.test}>
            <div className="window" style={{margin: "auto", pointerEvents: "all", width: "300px", zIndex: 1, backgroundColor: "#efefef"}}>
                <div className="title-bar">
                    <div className="title-bar-text">A Window With Stuff In It</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>
                <div className="window-body">
                    There's so much room for activities!
                </div>
            </div>
        // </div>
        
    );

}

export default Popup