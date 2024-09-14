function Info() {

    return (
        <>
            <p>
                As of today, 2024-09-13, there are <b>495,213</b> miles of love in the world.
            </p>
            <br />

            <menu role="tablist" className="multirows" style={{marginLeft:"-3px"}} >
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a><b>About</b></a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Privacy Policy</a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Terms of Use</a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>FAQs</a></li>
            </menu>
            <menu role="tablist" className="multirows" style={{marginLeft:"-3px"}}>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Moderation</a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Donate</a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Contact</a></li>
                <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Acknowledgements</a></li>
                {/* <li role="tab" style={{
                     backgroundColor: "#fff"}}><a>Who</a></li> */}
            </menu>
            <div className="window" role="tabpanel" style={{
                     backgroundColor: "#fff"}}>
                <div className="window-body">
                <p>
                    Notes From Afar is a site where you can leave anonymous messages about your long distance friendships, relationships, and family. It also functions as a communally constructed digital archive and ode to long distance love.
                </p>
                <br />
                <p>
                    Because it's the 2020's, and it's easier than ever to love people who live far away from you, but, as we all know, it's still incredibly difficult. So let's talk about it.
                </p> 
                </div>
            </div>
            <br />

            <div className="field-row" style={{width: "auto", margin: "10px"}}>
                <label htmlFor="range25"><p>Sound:</p></label>
                {/* <label htmlFor="range26" style={{fontSize: "12px", fontFamily: "monospace"}}>Mute</label> */}
                <input id="range26" type="range" min="1" max="11" value="5" />
                {/* <label htmlFor="range27" style={{fontSize: "12px", fontFamily: "monospace"}}>High</label> */}
            </div>
            <div className="field-row" style={{width: "auto", margin: "10px"}}>
                <label htmlFor="range25"><p>Spin:</p></label>
                {/* <label htmlFor="range26" style={{fontSize: "12px", fontFamily: "monospace"}}>Mute</label> */}
                <input id="range26" type="range" min="1" max="11" value="6" />
                {/* <label htmlFor="range27" style={{fontSize: "12px", fontFamily: "monospace"}}>High</label> */}
            </div>
            <br />
            <p style={{textAlign: "center"}}>Made with &lt;3 by <a href="https://shenaichan.github.io/" target="_blank" rel="noopener noreferrer">Shenai Chan</a> at the <a href="https://www.recurse.com/" target="_blank" rel="noopener noreferrer">Recurse Center</a></p>
        </>
    );
}

export default Info