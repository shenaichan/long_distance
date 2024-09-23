import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from 'components/App.tsx'
import 'index.css'

/**
 * want a link to a singular pin
 * - setCurrState to pinMenu
 * - setHighlightedPin to the pin associated with the public token
 * - pin/{public_token}
 * want a link to a message "thread" -- either one or two messages
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/pin/:public_share_token",
    element: <App />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    {/* <App />  */}
    {/* need to parameterize App, using useParams */}
  </StrictMode>,
)
