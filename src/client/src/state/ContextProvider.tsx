import { AppState, AppContext, useAppState } from "state/context"
import { ReactNode, useState } from 'react'
import { PinInPrivate, InventoryMessageIn, PinInPublic, MessageIn } from "api/api";
import { menuKind, coordinates, pinCreationState, NO_COORDINATES } from "components/App"

export function AppProvider( { children }: { children: ReactNode }) {
    const [stack, setStack] = useState<menuKind[]>(["info", "write", "inventory"]);
    const [pinLocation, setPinLocation] = useState<coordinates>({ longitude: -200, latitude: -100 });
    const [spinLevel, setSpinLevel] = useState<number>(2);
    const [soundLevel, setSoundLevel] = useState<number>(0);
    const [placeName, setPlaceName] = useState<string>("");
    const [sourcePlaceName, setSourcePlaceName] = useState<string>("");
    const [destinationPlaceName, setDestinationPlaceName] = useState<string>("");
    const [senderID, setSenderID] = useState<number>(-1);
    const [recipientID, setRecipientID] = useState<number>(-1);
    const [pins, setPins] = useState<PinInPrivate[]>([]);
    const [sentNotes, setSentNotes] = useState<InventoryMessageIn[]>([]);
    const [receivedNotes, setReceivedNotes] = useState<InventoryMessageIn[]>([]);
    const [highlightedPin, setHighlightedPin] = useState<PinInPrivate | PinInPublic | null>(null);
    const [ sourceState, setSourceState ] = useState<pinCreationState>("inactive")
    const [ destState, setDestState ] = useState<pinCreationState>("inactive")
    const [ pinIsHighlighted, setPinIsHighlighted ] = useState<boolean>(false)
    const [ threadIsHighlighted, setThreadIsHighlighted ] = useState<boolean>(false)
    const [ highlightedThread, setHighlightedThread ] = useState< MessageIn | null >(null)
    const [ isResponse, setIsResponse ] = useState<boolean>(false)
    const [ numWorldNotes, setNumWorldNotes ] = useState<number>(0)
    const [ randomNote, setRandomNote ] = useState<number>(-1)

    return (
        <AppContext.Provider
            value={{
                stack,
                setStack,
                pinLocation,
                setPinLocation,
                spinLevel,
                setSpinLevel,
                soundLevel,
                setSoundLevel,
                placeName,
                setPlaceName,
                sourcePlaceName,
                setSourcePlaceName,
                destinationPlaceName,
                setDestinationPlaceName,
                senderID,
                setSenderID,
                recipientID,
                setRecipientID,
                pins,
                setPins,
                sentNotes,
                setSentNotes,
                receivedNotes,
                setReceivedNotes,
                highlightedPin,
                setHighlightedPin,
                sourceState,
                setSourceState,
                destState,
                setDestState,
                pinIsHighlighted,
                setPinIsHighlighted,
                threadIsHighlighted,
                setThreadIsHighlighted,
                highlightedThread,
                setHighlightedThread,
                isResponse,
                setIsResponse,
                numWorldNotes,
                setNumWorldNotes,
                randomNote,
                setRandomNote
            }}
        >
            { children }
        </AppContext.Provider>
    )
    
}