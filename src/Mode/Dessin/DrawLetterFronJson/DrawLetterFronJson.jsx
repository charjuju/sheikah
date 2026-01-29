import { useState } from 'react';
import abcJson from '../../../abc.json'
import { motion } from 'framer-motion'

/**
 * 
 * @param {number} index index de la lettre 0 pour a 1 pour b etc...
 * @param {string} difficulte le niveaux d'aide ["support", "guidee", "autonome"] 
 * @returns affiche le support visuel de la lettre a faire en fonction de la difficulté:
 * support: montre ce que l'on dois faire
 * guidee: affiche les cellule au bonne endroit apré avoir valider
 * autonome: tu peux aller te faire foutre.
 */
export default function DrawLetterFronJson({ index, difficulte, help }) {
    switch (difficulte) {
        case "guidee":
            return (
                <section id='lettre-a-dessiner'>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 40px)",
                            gridTemplateRows: "repeat(7, 40px)",
                        }}
                    >
                        {abcJson && abcJson[index] && abcJson[index].writeArray.map((value, index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    backgroundColor: help[index] === 1 ? "red" : value ? "transparent" : "transparent",
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
            )
        case "autonome":

            break;
        default:
            return (
                <section id='lettre-a-dessiner'>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 40px)",
                            gridTemplateRows: "repeat(7, 40px)",
                        }}
                    >
                        {abcJson && abcJson[index] && abcJson[index].writeArray.map((value, index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    backgroundColor: help[index] === 1 ? "red" : value ? "#111" : "transparent",
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
            )
            break;
    }
}