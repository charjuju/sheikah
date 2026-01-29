import { useState, useRef, useMemo } from 'react'
import './App.css'
import { motion } from 'framer-motion'
import ModeDessin from './Mode/Dessin/ModeDessin.jsx'
import PanelControl from './panelControl/panelControl.jsx'
import ModeReconaisance from './Mode/Reconaisance/ModeReconaisance.jsx'

function App() {
  const [mode, setMode] = useState("Reconaisance")
  const [combo, setCombo] = useState(0)
  const [difficult, setDifficult] = useState("support")

  return (
    <div>
      <PanelControl mode={mode} setMode={setMode} combo={combo} setDifficult={setDifficult} />
      {mode === "Reconaisance" ?
        <ModeReconaisance combo={combo} setCombo={setCombo} difficult={difficult} />
        :
        <ModeDessin setCombo={setCombo} difficult={difficult} letterIndex={letterIndex} setLetterIndex={setLetterIndex} />
      }
    </div >
  )
}

export default App  