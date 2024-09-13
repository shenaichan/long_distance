import css from "components/App.module.css";
import { useState } from 'react';

import { Map } from "components/map/Map";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Map />

      <main>
        <header>
          <h1> notes from afar </h1>
          <div className={css.controls}>
            <p> my pins </p>
            <p> my favorites </p>
            <p> about </p>
          </div>
        </header>
        <footer>
          <h2> 567,937 miles of love </h2>
          <div className={css.controls}>
            <p className={css.create}> + CREATE PIN </p>
          </div>
        </footer>
      </main>
        
    </>
  )
}

export default App
