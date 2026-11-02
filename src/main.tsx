import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
// No StrictMode: the portrait engine registers global listeners once.
createRoot(document.getElementById('root')!).render(<App />);
