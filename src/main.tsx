import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { FilamentProvider } from './context/FilamentContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <FilamentProvider>
                    <App />
                </FilamentProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
);
