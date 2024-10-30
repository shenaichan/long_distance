import { PinInPrivate, InventoryMessageIn, PinInPublic, MessageInPrivate, MessageInPublic } from "api/api";
import { createContext, useContext } from "react";
import { menuKind, coordinates, pinCreationState } from "components/App"

export type AppState = {
  stack: menuKind[];
  setStack: (stack: menuKind[]) => void;
  sourceLocation: coordinates;
  setSourceLocation: (location: coordinates) => void;
  destLocation: coordinates;
  setDestLocation: (location: coordinates) => void;
  spinLevel: number;
  setSpinLevel: (level: number) => void;
  soundLevel: number;
  setSoundLevel: (level: number) => void;
  placeName: string;
  setPlaceName: (name: string) => void;
  sourcePlaceName: string;
  setSourcePlaceName: (name: string) => void;
  destinationPlaceName: string;
  setDestinationPlaceName: (name: string) => void;
  senderID: number;
  setSenderID: (id: number) => void;
  recipientID: number;
  setRecipientID: (id: number) => void;
  pins: PinInPrivate[];
  setPins: (pins: PinInPrivate[]) => void;
  sentNotes: InventoryMessageIn[];
  setSentNotes: (notes: InventoryMessageIn[]) => void;
  receivedNotes: InventoryMessageIn[];
  setReceivedNotes: (notes: InventoryMessageIn[]) => void;
  highlightedPin: PinInPrivate | PinInPublic | null;
  setHighlightedPin: (pin: PinInPrivate | PinInPublic | null ) => void;
  sourceState: pinCreationState;
  setSourceState: (state: pinCreationState) => void;
  destState: pinCreationState;
  setDestState: (state: pinCreationState) => void;
  pinIsHighlighted: boolean;
  setPinIsHighlighted: (pinState: boolean) => void;
  threadIsHighlighted: boolean;
  setThreadIsHighlighted: (threadState: boolean) => void;
  highlightedThread: MessageInPrivate | MessageInPublic | null;
  setHighlightedThread: (thread: MessageInPrivate | MessageInPublic | null) => void;
  isResponse: boolean;
  setIsResponse: (isResponse: boolean) => void;
  numWorldNotes: number;
  setNumWorldNotes: (num: number) => void;
  randomNote: number;
  setRandomNote: (num: number) => void;
  replyPW: string;
  setReplyPW: (pw: string) => void;
}

const noop = () => {};

export const AppContext = createContext<AppState>({
  stack: [],
  setStack: noop,
  sourceLocation: { latitude: -100, longitude: -200 },
  setSourceLocation: noop,
  destLocation: { latitude: -100, longitude: -200 },
  setDestLocation: noop,
  spinLevel: 0,
  setSpinLevel: noop,
  soundLevel: 0,
  setSoundLevel: noop,
  placeName: "",
  setPlaceName: noop,
  sourcePlaceName: "",
  setSourcePlaceName: noop,
  destinationPlaceName: "",
  setDestinationPlaceName: noop,
  senderID: 0,
  setSenderID: noop,
  recipientID: 0,
  setRecipientID: noop,
  pins: [],
  setPins: noop,
  sentNotes: [],
  setSentNotes: noop,
  receivedNotes: [],
  setReceivedNotes: noop,
  highlightedPin: null,
  setHighlightedPin: noop,
  sourceState: "inactive",
  setSourceState: noop,
  destState: "inactive",
  setDestState: noop,
  pinIsHighlighted: false,
  setPinIsHighlighted: noop,
  threadIsHighlighted: false,
  setThreadIsHighlighted: noop,
  highlightedThread: null,
  setHighlightedThread: noop,
  isResponse: false,
  setIsResponse: noop,
  numWorldNotes: 0,
  setNumWorldNotes: noop,
  randomNote: -1,
  setRandomNote: noop,
  replyPW: "",
  setReplyPW: noop,
  }
);

export const useAppState = () => useContext(AppContext);