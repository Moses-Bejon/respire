import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {CountButton} from "./countButton.tsx";
import { PlayerView } from './playerView.tsx';

const aView = new PlayerView()
const App = aView.App.bind(aView)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
