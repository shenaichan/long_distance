import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from 'components/App.tsx'
import 'index.css'



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
  <RouterProvider router={router}/>
)
