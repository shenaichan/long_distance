import css from "components/App.module.css";
import { useState } from 'react';

import Map from "components/map/Map";
import Popup from "components/popup/Popup";
import Info from "components/popup/info/Info"
import Pins from "components/popup/pins/Pins"
import Favorites from "components/popup/favorites/Favorites"

import longdist from "assets/longdist_long.mp3";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Map />

      <div className={css.information}>
        <div className={css.left}>
          <Popup 
            title="Welcome to Notes From Afar!"
            content={ Info() }
          />
        </div>
        <div className={css.center}>
          <Popup 
            title="Leave a message"
            content={<>
              <p>From: <b><em>Sunnyvale, CA, USA</em></b></p>
              <p>To: <b><em>Austin, TX, USA</em></b></p>
              <br />
              
              {/* <textarea style={{fontSize: "14px", width: "378px", resize: "vertical", maxHeight: "50vh", fontStyle: "italic"}}>
              </textarea> */}
              <div className="window" contentEditable="true" style={{backgroundColor: "white", fontSize: "14px", width: "378px", height: "300px", fontStyle: "italic", wordWrap: "break-word",
	        overflowWrap: "break-word"}}>
                <div className={css.typewriter}> <p>when I see you again, we should...</p></div>
              </div>
              {/* <br /> */}
              <br />
              <button style={{textAlign: "center", 
                              display: "block", 
                              margin: "0 auto", 
                              backgroundColor: "#c8e8e8",
                              fontSize: "14px"}}>
                  Submit that thang!
              </button>
            </>}
          />
        </div>
        <div className={css.right}>
          <Popup 
            title="My pins"
            content={ Pins() }
          />
          <Popup 
            title="My favorites"
            content={ Favorites() }
          />
        </div>
        
      </div>
        
    </>
  )
}

export default App
