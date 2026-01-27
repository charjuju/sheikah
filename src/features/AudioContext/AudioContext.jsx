import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AudioContext = createContext();

/** 
 
**  C'est basicment un petit bazard pour controler le volume, donc du coup
**  comme pour les notification fo englober le tout dans l'app ou le main jsx,
**  fin bref la base quoi lol

****************       POUR CE QUI EST DES FUNCTION ***************************

**  import { useAudio } from "../../Hooks/AudioContext";
**
**      const {
**          playMusic
**          stopMusic
**          pauseMusic
**          resumeMusic
**          playSound
**          stopSound
**          stopAllSounds
**          generalVolume,
**          musicVolume,
**          soundVolume,
**          updateGeneralVolume,
**          updateMusicVolume,
**          updateSoundVolume,
**      } = useAudio();

******* Contrôles music *******************************************************

**      playMusic(src, addNotification): on est obliger de le faire passer par la sinon c'est completement illégame
**              const { addNotification } = useNotification();
**              PATH: src/components/NotificationProvider/NotificationContext.jsx
**          c'est pour lancer une music, ça prend le path de la music elle sera jourer en boucle
**          et si il y a un un prblem au lancement ça ouvre une notification pour la lancer
**      stopMusic():
**          ça stop la music
**      pauseMusic():
**          ça pause la music
**      resumeMusic():
**          ça resume la music

******* Controles sons ********************************************************

**      playSound(): Retrun => soundId
**      stopSound(soundId):
**      stopAllSounds():

  ***** Controles des volumes *************************************************

**      updateGeneralVolume():
**      updateMusicVolume():
**      updateSoundVolume():

*/
export const AudioProvider = ({ children }) => {
    const [generalVolume, setGeneralVolume] = useState(100);
    const [musicVolume, setMusicVolume] = useState(50);
    const [soundVolume, setSoundVolume] = useState(50);

    const musicRef = useRef(null);
    const soundsRef = useRef(new Map());

    // Utiliser des refs pour les volumes afin d'éviter les re-renders (voirs petitCours ./petitCours/re-render.txt)
    const volumesRef = useRef({ generalVolume: 100, musicVolume: 50, soundVolume: 50 });

    // Mettre à jour les refs quand les volumes changent
    useEffect(() => {
        volumesRef.current = { generalVolume, musicVolume, soundVolume };
    }, [generalVolume, musicVolume, soundVolume]);

    useEffect(() => {
        // Initialiser l'audio pour la musique
        musicRef.current = new Audio();
        musicRef.current.loop = true;

        return () => {
            // Cleanup
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
            soundsRef.current.forEach(sound => sound.pause());
            soundsRef.current.clear();
        };
    }, []);

    /**
     * Calculer le volume effectif (utilise les refs au lieu des states pour pas les fameux re-renders)
     * @param {string} type 'music' ou 'sound' (mais bon si c'est pas music c'est song quoi)
     */
    const getEffectiveVolume = useCallback((type) => {
        const { generalVolume: gv, musicVolume: mv, soundVolume: sv } = volumesRef.current;
        const baseVolume = type === 'music' ? mv : sv;
        return (gv / 100) * (baseVolume / 100);
    }, []); // Pas de dépendances car on utilise les refs ouais c'est complex la

    // Mettre à jour le volume de la musique en cours
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = getEffectiveVolume('music');
        }
    }, [generalVolume, musicVolume]);  // Dépendances directes sur les volumes de la music et general

    /**
     * Jouer une musique
     * @param {str} src le path du song
     * @param {useNotification} addNotification src/components/NotificationProvider/NotificationContext.jsx
    */
    const playMusic = useCallback((src, addNotification) => {
        if (!musicRef.current) return;

        // Construire l'URL complète pour la comparaison
        const fullSrc = src.startsWith('http') ? src : window.location.origin + src;
        const currentSrc = musicRef.current.src;

        // Si c'est la même musique, ne rien faire
        if (currentSrc === fullSrc) {
            if (musicRef.current.paused) {
                musicRef.current.play().catch(() => {
                    if (addNotification) {
                        addNotification(
                            "🔊 Cliquez pour activer la musique",
                            "blue",
                            0,
                            () => musicRef.current.play()
                        );
                    }
                });
            }
            return;
        }

        musicRef.current.src = src;
        musicRef.current.volume = getEffectiveVolume('music');

        musicRef.current.play().catch(() => {
            if (addNotification) {
                addNotification(
                    "🔊 Cliquez pour activer la musique",
                    "blue",
                    0,
                    () => musicRef.current.play()
                );
            }
        });
    }, [getEffectiveVolume]); // getEffectiveVolume n'a plus de dépendances, donc playMusic est stable

    /**
     * Arrêter la musique
    */
    const stopMusic = useCallback(() => {
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.currentTime = 0;
        }
    }, []);

    /**
     * met sur pause
    */
    const pauseMusic = useCallback(() => {
        if (musicRef.current) {
            musicRef.current.pause();
        }
    }, []);

    /**
     * remet le music si elle est sur pause
    */
    const resumeMusic = useCallback(() => {
        if (musicRef.current && musicRef.current.src) {
            musicRef.current.play();
        }
    }, []);

    /**
     * pour jouer un song
     * @param {str} src le path du song
     * @param {boolean} loop de base sur false
     * @return {number} soundId (number)
     * 
    */
    const playSound = useCallback((src, loop = false) => {
        const soundId = Date.now() + Math.random();
        const sound = new Audio(src);
        sound.volume = getEffectiveVolume('sound');
        sound.loop = loop;

        soundsRef.current.set(soundId, sound);

        sound.play();

        // Nettoyer après la lecture si ce n'est pas en loop
        if (!loop) {
            sound.addEventListener('ended', () => {
                soundsRef.current.delete(soundId);
            });
        }

        return soundId;
    }, [getEffectiveVolume]);

    /**
     * Arrêter un son spécifique
     * @param {number} soundId son sound id
     * 
    */
    const stopSound = useCallback((soundId) => {
        const sound = soundsRef.current.get(soundId);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
            soundsRef.current.delete(soundId);
        }
    }, []);

    /**
     * Arrêter tous les sons
    */
    const stopAllSounds = useCallback(() => {
        soundsRef.current.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        soundsRef.current.clear();
    }, []);

    /**
     * Mettre à jour les volumes
     * @param {number} value un chiffre entre 0 et 100
    */
    const updateGeneralVolume = useCallback((value) => {
        const clampedValue = Math.max(0, Math.min(100, value));
        setGeneralVolume(clampedValue);
    }, []);

    /**
     * Mettre à jour le volume de la music
     * @param {number} value un chiffre entre 0 et 100
    */
    const updateMusicVolume = useCallback((value) => {
        const clampedValue = Math.max(0, Math.min(100, value));
        setMusicVolume(clampedValue);
    }, []);

    /**
     * Mettre à jour le volume du song
     * @param {number} value un chiffre entre 0 et 100
    */
    const updateSoundVolume = useCallback((value) => {
        const clampedValue = Math.max(0, Math.min(100, value));
        setSoundVolume(clampedValue);

        // Mettre à jour le volume de tous les sons en cours
        const { generalVolume: gv } = volumesRef.current;
        soundsRef.current.forEach(sound => {
            sound.volume = (gv / 100) * (clampedValue / 100);
        });
    }, []);

    const value = {
        // États
        generalVolume,
        musicVolume,
        soundVolume,

        // Contrôles musique elle vas se répeter en boucle
        playMusic,
        stopMusic,
        pauseMusic,
        resumeMusic,

        // Contrôles sons
        playSound,
        stopSound,
        stopAllSounds,

        // Contrôles volumes
        updateGeneralVolume,
        updateMusicVolume,
        updateSoundVolume,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio doit étre utilisé dans un AudioProvider');
    }
    return context;
};