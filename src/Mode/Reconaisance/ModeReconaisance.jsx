import { useEffect, useState } from "react";
import { useAudio } from "../../features/AudioContext/AudioContext";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getWriteArrayByLetter } from "../../utils/alphabetUtils";
import abcJson from '../../abc.json'

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const letter_progresse = "EAISTNRULODCMPVQFBGHJXYZKW".split("");

/**
 * c'est pour apprendre a d'abord reconaitre les lettre avant de les dessiner comme on dis:
 *      il faut savoir marché avant d'apprendre a courire - monsieur autef prof de cuisine
 * 
 * @param {number} combo le nombre de réusite d'affilé 
 * @param function setCombo(value) le set de combot
 * @returns 
 */
export default function ModeReconaisance({ combo, setCombo }) {
    const [miss, setMiss] = useState(false);
    const [missCombo, setMissCombo] = useState(0);


    const {
        playSound,
    } = useAudio();

    const [targetLetter, setTargetLetter] = useState("A");

    /**
     * 
     * c'est pour permettre un aprentissage logique, c'est bien plus pertinant de savoir le E que le Z par exemple
     * 
     * @param {number} combo 
     * @returns la liste des lettre que l'utilisateur peux prétendre avoir avec son combot actuel
     */
    const getUnlockedLetters = (combo) => {
        const base = 3;
        const unlockedCount = Math.min(
            letter_progresse.length,
            base + Math.floor(combo / 2)
        );

        return letter_progresse.slice(0, unlockedCount);
    };

    /**
     * 
     * c'est pour avoir une lettre aléatoire en fonction de ton combot 
     * 
     * voir aussi getUnlockedLetters = (combo)
     * 
     * @param {number} combo 
     */
    const randomLetter = (combo) => {
        const unlockedLetters = getUnlockedLetters(combo);
        console.log("unlockedLetters", unlockedLetters, letter_progresse)
        const index = Math.floor(Math.random() * unlockedLetters.length);
        setTargetLetter(unlockedLetters[index]);
    };


    useMemo(() => {
        randomLetter(combo);
    }, []);


    const handleClick = (letter) => {
        if (letter === targetLetter) { // super t'as réusi
            randomLetter(combo)
            playSound("for-sur-macron.mp3")
            if (missCombo >= 3) { // si t'as trop rater avant ça t'enléve ton combot
                setCombo(0)
            }
            setMissCombo(0)
            setCombo(prev => prev + 1)
        } else { // t'as trop raté c'est la bez
            if (missCombo > 3) {
                setCombo(0)
            }
            setMiss(true);
            setTimeout(() => setMiss(false), 400);
            if (combo > 10) {
            } else {
                if (missCombo === 2) {
                    playSound("motus-boule-noire_cTY2JG4.mp3")
                }
                playSound("missed_it.mp3")
            }
            setMissCombo(prev => prev + 1)
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "center",
            }}
        >
            <motion.div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}
                animate={
                    miss
                        ? { x: [-10, 10, -10, 10, 0] }
                        : { x: 0 }
                }
                transition={{ duration: 0.4 }}
            >
                <section id='lettre-a-dessiner'>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 40px)",
                            gridTemplateRows: "repeat(7, 40px)",
                        }}
                    >
                        {abcJson && getWriteArrayByLetter(abcJson, targetLetter).map((value, index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    backgroundColor: value ? miss ? "red" : "#9adaf6" : "transparent",
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
                    </div>
                </section>
                {missCombo > 2 &&
                    <motion.h1
                        transition={{ duration: 0.4 }}
                        style={{
                            position: "absolute",
                            top: "-80px",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: 'none',
                            color: 'rgba(255, 255,255, 0.30)'
                        }}
                    >
                        {targetLetter}
                    </motion.h1>
                }
            </motion.div>


            {/* Boutons alphabet */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: 'wrap',
                    maxWidth: '400px',
                    justifyContent: 'center'
                }}
            >
                {alphabet.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => handleClick(letter)}
                        style={{
                            padding: "10px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div >
    );
}
