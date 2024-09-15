import css from "components/popup/pins/Pins.module.css";

function Pins() {
    return (
        <>
            <p>
                You don't have any pins yet! Why don't you make one?
            </p>
            <br />
            <button>
                Make a pin
            </button>
            <br />

            <ul className="tree-view">
                <li>
                    <details>
                    <summary className={css.dropdown}>Sunnyvale, CA, USA</summary>
                    <ul className={css.box}>
                        <li>
                            from Austin, TX, USA
                        </li>
                        <li>
                            to Brooklyn, NY, USA
                        </li>
                        <li>
                            from Austin, TX, USA
                        </li>
                        <li>
                            to Brooklyn, NY, USA
                        </li>
                        <li>
                            from Austin, TX, USA
                        </li>
                        <li>
                            to Brooklyn, NY, USA
                        </li>
                        <li>
                            from Austin, TX, USA
                        </li>
                        <li>
                            to Brooklyn, NY, USA
                        </li>
                </ul>
                    </details>
                </li>
            </ul>
        </>
    );
}

export default Pins