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
