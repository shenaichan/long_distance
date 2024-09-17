type CreateProps = {       
    setMouseLocation: (location: [number, number]) => void;
    placeName: string;
}

function Create({setMouseLocation, placeName}: CreateProps) {
    return (
        <div>
            <p>
                {
                    placeName === "nowhere in particular" ?
                    "Sorry, we couldn't find a place name for your location. " :
                    ""
                }
                Create a new pin representing you at <b>{placeName}</b>?
            </p>
            <div style={{display: "flex", justifyContent: "center"}}>
                <button style={{margin: "0"}} onClick={() => setMouseLocation([-1, -1])}>Yes</button>
                <button style={{margin: "0"}} onClick={() => setMouseLocation([-1, -1])}>No</button>
            </div>
        </div>
    )
}

export default Create;