import css from "components/popup/message/Message.module.css";


function Message() {
    return (
        <>
            <p>
                From: <b><em>Sunnyvale, CA, USA</em></b>
            </p>
            <p>
                To: <b><em>Austin, TX, USA</em></b>
            </p>
            <br />
            <div className={`window ${css.textEntryBox}`}>
                <div className={css.typewriter}> 
                    <p>
                        when I see you again, we should...
                    </p>
                </div>
            </div>
            <br />
            <button>
                Submit that thang!
            </button>
        </>
    );
}

export default Message