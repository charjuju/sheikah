import { motion } from "framer-motion"
import DifficultySelector from './DifficultySelector/DifficultySelector.jsx'
import { useState } from "react"
import { ArrowBigRightDash, Flame } from "lucide-react"


const levels = [
    { id: "support", label: "Support visuel" },
    { id: "guidee", label: "Guidée" },
    { id: "autonome", label: "Autonome" },
];

export default function PanelControl({ mode, setMode, setDifficult, combo }) {
    const [isActive, setIsActive] = useState(false)


    const hendelDifficultChange = (dif) => {
        setDifficult(dif);
        setIsActive(false);
    }

    return (
        <>
            <motion.div onClick={() => setIsActive(prev => !prev)}
                style={{ zIndex: '999', position: 'fixed', top: '10px', left: '230px', borderRadius: '100px', height: '60px' }} animate={{ x: isActive ? 0 : -210, rotate: isActive ? 180 : 0 }}>
                <ArrowBigRightDash size={60} />
            </motion.div>
            <motion.div onClick={() => setIsActive(prev => !prev)}
                style={{ zIndex: '999', position: 'fixed', top: '10px', right: '10px', borderRadius: '100px', height: '60px' }}>
                <Flame color="red" />
                <h3 style={{ margin: '0px', color: "red", padding: '0px', marginLeft: '0px' }}>{combo}</h3>
            </motion.div>
            <motion.div
                animate={{ x: isActive ? 8 : -210 }}
                style={{
                    position: 'fixed',
                    left: '-50px',
                    top: '0px',
                    width: '50%',
                    maxWidth: '200px',
                    height: '100%',
                    zIndex: '100',
                    backgroundColor: "white",
                    borderRight: 'solid 1px black',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingLeft: '50px'
                }}>
                <h2 style={{ color: 'black' }}>Mode</h2>
                <div style={{ display: "flex", gap: "8px", flexWrap: 'wrap' }}>

                    <motion.button
                        onClick={() => setMode("Reconaisance")}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            backgroundColor: mode === "Reconaisance" ? "#4F46E5" : "#E5E7EB",
                            color: isActive ? "#FFFFFF" : "#111827",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        Reconaisance
                    </motion.button>
                    <motion.button
                        onClick={() => setMode("Dessin")}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            backgroundColor: mode === "Dessin" ? "#4F46E5" : "#E5E7EB",
                            color: isActive ? "#FFFFFF" : "#111827",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        Dessin
                    </motion.button>
                </div>
                <h2 style={{ color: 'black' }}>Difficulté</h2>
                {mode === "Dessin" &&
                    <DifficultySelector levels={levels} onChange={hendelDifficultChange} />
                }
            </motion.div>
        </>
    )
}