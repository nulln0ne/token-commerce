import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../shared/ui/styles/globals.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
