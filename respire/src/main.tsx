import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {CountView} from "./countView.tsx";

const aView = new CountView()
const App = aView.App.bind(aView)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
