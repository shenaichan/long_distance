import css from "components/popup/pins/Pins.module.css";

function Pins() {
    return (
        <>
            <p>
                You don't have any pins yet! Why don't you make one?
            </p>
            <br />
            <button style={{textAlign: "center", 
                            display: "block", 
                            margin: "0 auto", 
                            backgroundColor: "#c8e8e8",
                            fontSize: "14px"}}>
                Make a pin
            </button>
            <br />

            <ul className="tree-view">
                <li>
                    <details>
                    {/* <div className={css.container}> */}
                    <summary id={css.bro}>Sunnyvale, CA, USA</summary>
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
                    {/* </div> */}
                    </details>
                </li>
            </ul>
        </>
    );
}

export default Pins