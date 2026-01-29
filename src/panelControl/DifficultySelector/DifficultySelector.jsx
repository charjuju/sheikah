import { useState } from "react";
import { motion } from "framer-motion";

/**
 * 
 * @param {json} levels 
 * const levels = [{ id: "facile", label: "Difficulté facile" }, ... ];
 * @param function onChange(String) pour set l'id du levels de difficulté
 * @returns 
 */
export default function DifficultySelector({ levels, onChange }) {
    const [selected, setSelected] = useState("support");

    const handleSelect = (level) => {
        setSelected(level);
        onChange?.(level);
    };

    return (
        <div style={{ display: "flex", gap: "8px", flexWrap: 'wrap' }}>
            {levels.map((level) => {
                const isActive = selected === level.id;
                return (
                    <motion.button
                        key={level.id}
                        onClick={() => handleSelect(level.id)}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            backgroundColor: isActive ? "#4F46E5" : "#E5E7EB",
                            color: isActive ? "#FFFFFF" : "#111827",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {level.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
