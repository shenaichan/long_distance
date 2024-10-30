import { checkIfMapLoadAllowed } from "api/api"
import { useState, useEffect } from "react"
import App from "components/App"
import SorryTooMuchApi from "components/SorryTooMuchApi"
import SorryNoMobile from "components/SorryNoMobile"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppProvider } from 'state/ContextProvider'

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "/pin/:public_share_token",
      element: <App />
    },
    {
      path: "/reply/:secret_reply_token",
      element: <App />
    }
])

type loadState = 
     "none"
    | "no load"
    | "yes load"

function LoadGuard() {

    const [mapLoadAllowed, setMapLoadAllowed] = useState<loadState>("none")
    const [mobile, setMobile] = useState<boolean>(true)

    useEffect(() => {
        async function checkLoadAllowed() {
            const loadAllowed = await checkIfMapLoadAllowed()
            setMapLoadAllowed(loadAllowed ? "yes load" : "no load")
        }
        checkLoadAllowed()
        setMobile(( window.innerWidth <= 800 ) || ( window.innerHeight <= 600 ))
    }, [])

    return(
        <>
        {
            mapLoadAllowed === "none" ?
                    <></>
                :
                    mapLoadAllowed === "yes load" ?
                            mobile ?
                                <SorryNoMobile/> 
                            :
                                <AppProvider>
                                    <RouterProvider router={router}/>
                                </AppProvider>
                        :              
                            <SorryTooMuchApi/>
        }
        </>
    )
}

export default LoadGuard