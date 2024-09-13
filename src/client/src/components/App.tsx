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

      <div className={css.information}>
        <div className={css.left}>
          <Popup />
        </div>
        <div className={css.right}>
          <Popup />
          <Popup />
        </div>
        
      </div>
        
    </>
  )
}

export default App
