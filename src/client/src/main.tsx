import { createRoot } from 'react-dom/client'
import LoadGuard from "LoadGuard"
import 'index.css'



createRoot(document.getElementById('root')!).render(
  <LoadGuard/>
)
