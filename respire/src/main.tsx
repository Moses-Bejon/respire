import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {CountButton} from "./countButton.tsx";

const aView = new CountButton()
const App = aView.App.bind(aView)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
