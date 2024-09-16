type ConfirmProps = {       
    location: [number, number];
    setMouseLocation: (location: [number, number]) => void;
}

function Confirm({location, setMouseLocation}: ConfirmProps) {
    return (
        <>
            {
                (location[0] != -1 && location[1] != -1) ?
                    <div style={{position: "absolute", top: location[1], left: location[0]}}>
                    <button onClick={() => setMouseLocation([-1, -1])}>Confirm Location</button>
                    </div>
                    :null
            }
        </>
    )
}

export default Confirm;