import { useState, useRef, useMemo } from 'react'
import { useNotification } from "../../features/NotificationProvider/NotificationContext.jsx"
import '../../features/NotificationProvider/NotificationContainer.css';
import { useAudio } from '../../features/AudioContext/AudioContext.jsx';
import { motion } from 'framer-motion'
import abcJson from '../../abc.json'
import DrawLetterFronJson from './DrawLetterFronJson/DrawLetterFronJson.jsx'
import PanelControl from '../../panelControl/panelControl.jsx'


/**
 * 
 * @param {string} difficult la difficulté:
 * support: montre ce que l'on dois faire
 * guidee: affiche les cellule au bonne endroit apré avoir valider
 * autonome: tu peux aller te faire foutre.
 * @param function setCombo(nbr) pour set le combot quoi
 * @returns 
 */
export default function ModeDessin({ difficult, setCombo }) {
  const [letterIndex, setLetterIndex] = useState(0)

  const [help, setHelp] = useState([
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ])
  const {
    playSound,
  } = useAudio();
  const [writeArray, setWriteArray] = useState([
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ])
  const [isDrawing, setIsDrawing] = useState(false)
  const processedCells = useRef(new Set())

  const handlePointerMove = (e) => {
    if (!isDrawing) return

    // l'élément sou le pédo fin bref
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (!element) return

    // vérifie si c une selule et lui choure son index
    const index = element.getAttribute('data-index')
    if (index !== null) {
      const idx = parseInt(index)

      // pour pas que la cellule se fare recolorier / gommer en 1 trait
      if (!processedCells.current.has(idx)) {
        setWriteArray((prev) => {
          const next = [...prev]
          next[idx] = next[idx] === 0 ? 1 : 0
          return next
        })
        processedCells.current.add(idx)
      }
    }
  }

  const handlePointerDown = (e) => {
    setIsDrawing(true)
    processedCells.current.clear()

    // l'élément sou le pédo fin bref
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (!element) return

    // vérifie si c une selule et lui choure son index
    const index = element.getAttribute('data-index')
    if (index !== null) {
      const idx = parseInt(index)

      setWriteArray((prev) => {
        const next = [...prev]
        next[idx] = next[idx] === 0 ? 1 : 0
        return next
      })
      processedCells.current.add(idx)
    }
    handlePointerMove(e)
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
    processedCells.current.clear()
  }

  const handelValider = () => {
    const newHelp = [];
    let isEqual = true;

    for (let i = 0; writeArray.length > i; i++) {
      if (abcJson[letterIndex].writeArray[i] === writeArray[i]) {
        newHelp.push(0);
      } else {
        newHelp.push(1);
        isEqual = false;
      }
    }

    if (isEqual) {
      setHelp(newHelp);
      setCombo(prev => prev + 1);
      playSound("for-sur-macron.mp3")
      setLetterIndex(Math.floor(Math.random() * abcJson.length));
      setWriteArray([
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ])
    } else {
      setCombo(0);
      playSound("guess-what_.mp3")
      setHelp(newHelp);
    }
  }

  return (
    <div>
      <div style={{ height: '100%', width: '100%', overflow: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <DrawLetterFronJson index={letterIndex} difficulte={difficult} help={help} />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 40px)",
                gridTemplateRows: "repeat(7, 40px)",
                userSelect: "none",
                touchAction: "none",
                border: "1px solid black"
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {writeArray.map((value, index) => (
                <motion.div
                  key={index}
                  data-index={index}
                  animate={{
                    backgroundColor: value ? "#9adaf6" : "transparent",
                    scale: value ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    pointerEvents: "auto",
                  }}
                />
              ))}
              <h1
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: '180px',
                  pointerEvents: 'none',
                  color: 'rgba(255, 255,255, 0.30)'
                }}
              >
                {abcJson[letterIndex].l.toUpperCase()}
              </h1>
            </div>
          </div>
          <button onClick={() => handelValider()}>VALIDER</button>
        </div>
      </div>
    </div >
  )
}