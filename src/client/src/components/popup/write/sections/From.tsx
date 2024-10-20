function From() {
    return(
        <>
            <div style={{"display": "flex"}}>
                <p>
                    <b>From:</b>
                </p>
                <button style={{"flex": 1, "margin": "2px"}}>
                    Choose on map
                </button>
                <button style={{"flex": 1, "margin": "2px"}}>
                    Pick from your pins
                </button>
            </div>
        </>
    )
}

export default From