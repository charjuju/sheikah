import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNotification } from "./features/NotificationProvider/NotificationContext.jsx"
import './features/NotificationProvider/NotificationContainer.css';
import { useAudio } from './features/AudioContext/AudioContext.jsx';


function App() {
  const { addNotification } = useNotification();
  const [songId, setSongId] = useState(null)
  const {
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
    updateSoundVolume
  } = useAudio();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <section id='gestionNotification'>
        <h1>Gestion des notification</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => addNotification("salut", "blue", 500)}>notification bleu 500ms</button>
          <button onClick={() => addNotification("SALUT !", "red", 1000)}>notification rouge 1s</button>
          <button onClick={() => addNotification("clique pour log salut !", "orange", 0, () => console.log("salut"))}>notification orange infini</button>
        </div>
      </section>
      <section id='gestionDuSong'>
        <h1>Gestion du song</h1>
        <h2>musique</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => playMusic("YKWIM.mp3")}>playMusic test</button>
          <button onClick={() => stopMusic()}>stopMusic test</button>
          <button onClick={() => pauseMusic()}>pauseMusic test</button>
          <button onClick={() => resumeMusic()}>resumeMusic test</button>
        </div>
        <h2>Bruitage</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setSongId(playSound("for-sur-macron.mp3"))}>playSound test</button>
          <button onClick={() => stopSound(songId)}>stopSound test (id: {songId})</button>
          <button onClick={() => stopAllSounds()}>stopAllSounds test</button>
        </div>
        <h2>general volume gestion 0 - 100</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => updateGeneralVolume(10)}>updateGeneralVolume 10%</button>
          <button onClick={() => updateGeneralVolume(0)(songId)}>updateGeneralVolume 0%</button>
          <button onClick={() => updateGeneralVolume(100)}>updateGeneralVolume 100%</button>
        </div>
        <h2>music volume gestion 0 - 100</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => updateMusicVolume(10)}>updateMusicVolume 10%</button>
          <button onClick={() => updateMusicVolume(0)(songId)}>updateMusicVolume 0%</button>
          <button onClick={() => updateMusicVolume(100)}>updateMusicVolume 100%</button>
        </div>
        <h2>general sound gestion 0 - 100</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => updateSoundVolume(10)}>updateSoundVolume 10%</button>
          <button onClick={() => updateSoundVolume(0)(songId)}>updateSoundVolume 0%</button>
          <button onClick={() => updateSoundVolume(100)}>updateSoundVolume 100%</button>
        </div>
      </section>
    </>
  )
}

export default App
