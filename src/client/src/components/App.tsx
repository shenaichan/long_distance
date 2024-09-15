import css from "components/App.module.css";

import Map from "components/map/Map";
import Popup from "components/popup/Popup";
import Info from "components/popup/info/Info"
import Pins from "components/popup/pins/Pins"
import Favorites from "components/popup/favorites/Favorites"
import Message from "components/popup/message/Message"
import longdist from "assets/longdist_long.mp3";
import { popupKind } from "types";

import { useState } from "react";

function App() {

  const [stack, setStack] = useState<popupKind[]>(["info", "message", "pins", "favorites"]);

  function reStack(popup: popupKind) {
    let newStack = [...stack]
    let index = newStack.indexOf(popup); 
    newStack.splice(index, 1); 
    newStack.push(popup);
    setStack(newStack);
  }

  return (
    <>

      <Map />
      
      
      <Popup 
        name="info"
        reStack={reStack}
        title="Welcome to Notes From Afar!"
        content={<Info />}
        zIndex={stack.indexOf("info") + 1}
        top="20px"
        left="20px"
      />
      <Popup 
        name="message"
        reStack={reStack}
        title="Leave a message"
        content={<Message />}
        zIndex={stack.indexOf("message") + 1}
        top="calc(50vh - 300px)"
        left="calc(50vw - 200px)"
      />
      <Popup 
        name="pins"
        reStack={reStack}
        title="My pins"
        content={ <Pins /> }
        zIndex={stack.indexOf("pins") + 1}
        top="20px"
        left="calc(100vw - 400px - 20px)"
      />
      <Popup 
        name="favorites"
        reStack={reStack}
        title="My favorites"
        content={ <Favorites /> }
        zIndex={stack.indexOf("favorites") + 1}
        top="50vh"
        left="calc(100vw - 400px - 20px)"
      />
                
    </>
  )
}

export default App
