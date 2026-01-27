import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './features/NotificationProvider/NotificationContext.jsx'
import NotificationContainer from './features/NotificationProvider/NotificationContainer.jsx';
import { AudioProvider } from './features/AudioContext/AudioContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider >
      <NotificationContainer />
      <AudioProvider>
        <App />
      </AudioProvider>
    </NotificationProvider>
  </StrictMode>,
)
