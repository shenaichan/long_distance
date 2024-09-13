import css from "components/App.module.css";
import { useState } from 'react';

import Map from "components/map/Map";
import Popup from "components/popup/Popup";

import longdist from "assets/longdist_long.mp3";

function App() {
  const [count, setCount] = useState(0)
  // const music = new Audio(longdist);

  return (
    <>

      <Map />

      {/* <main> */}
      <div className={css.test}><Popup /></div>
        {/* <header>
          <h1> notes from afar </h1>
          <div className={css.headerConnector}></div>
          <div className={css.controls}>
          <audio controls loop>
            <source src={longdist} type="audio/mpeg" />
          Your browser does not support the audio element.
          </audio>
            <p> my pins </p>
            <p> my favorites </p>
            <p> about </p>
          </div>
        </header> */}
        
        {/* <footer>
          <h2> 567,937 miles of love </h2>
          <div className={css.controls}>
            <p className={css.create}> + CREATE PIN </p>
          </div>
        </footer> */}
      {/* </main> */}
        
    </>
  )
}

export default App
