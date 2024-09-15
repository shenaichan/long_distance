import css from "components/popup/pins/Pins.module.css";

function Pins() {

    function makePin() {
        console.log("made a pin");
        fetch('http://127.0.0.1:8000/api/create_pin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                latitude: 37.3688,
                longitude: -122.0748,
                place_name: "Sunnyvale, CA, USA",
            }),
        })
            .then(response => response.json())
            .then(result => console.log(result));
    }

    return (
        <>
            <p>
                You don't have any pins yet! Why don't you make one?
            </p>
            <br />
            <button onClick={makePin}>
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