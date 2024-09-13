import css from "components/popup/Popup.module.css";

function Popup() {

    return (
        <div className={css.popup}>
            <label>
                Text input: <textarea name="myInput" />
            </label>
        </div>
    );

}

export default Popup