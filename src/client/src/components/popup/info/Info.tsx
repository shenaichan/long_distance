import css from "components/popup/info/Info.module.css"

function Info() {

    return (
        <>
            <p>
                As of today, 2024-09-13, there are <b>495,213</b> miles of love in the world.
            </p>
            <br />

                <menu role="tablist" className={`multirows ${css.tabs}`} >
                    <li role="tab" id="about"><a><b>About</b></a></li>
                    <li role="tab" id="privacy"><a>Privacy Policy</a></li>
                    <li role="tab" id="terms"><a>Terms of Use</a></li>
                    <li role="tab" id="faqs"><a>FAQs</a></li>
                </menu>
                <menu role="tablist" className={`multirows ${css.tabs}`}>
                    <li role="tab" id="moderation"><a>Moderation</a></li>
                    <li role="tab" id="donate"><a>Donate</a></li>
                    <li role="tab" id="contact"><a>Contact</a></li>
                    <li role="tab" id="acknowledgements"><a>Acknowledgements</a></li>
                </menu>
                <div className={`window ${css.info}`} role="tabpanel">
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

            <div className={`field-row ${css.slider}`}>
                <label htmlFor="soundRange"><p>Sound:</p></label>
                <input id="soundRange" type="range" min="1" max="11" value="5" />
            </div>
            <div className={`field-row ${css.slider}`}>
                <label htmlFor="spinRange"><p>Spin:</p></label>
                <input id="spinRange" type="range" min="1" max="11" value="6" />
            </div>
            <br />
            <p style={{textAlign: "center"}}>Made with &lt;3 by <a href="https://shenaichan.github.io/" target="_blank" rel="noopener noreferrer">Shenai Chan</a> at the <a href="https://www.recurse.com/" target="_blank" rel="noopener noreferrer">Recurse Center</a></p>
        </>
    );
}

export default Info