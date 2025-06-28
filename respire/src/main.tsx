import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {View} from './view.tsx'

const aView = new View()
const App = aView.App.bind(aView)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
