import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { InventoryPage } from './pages/InventoryPage';
import { FilamentDetail } from './pages/FilamentDetail';
import { Settings } from './pages/Settings';

function App() {
    return (
        <>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={
                        <main className="main-content with-filter">
                            <InventoryPage />
                        </main>
                    } />
                    <Route path="/filament/:id" element={
                        <main className="main-content">
                            <FilamentDetail />
                        </main>
                    } />
                    <Route path="/settings" element={
                        <main className="main-content">
                            <Settings />
                        </main>
                    } />
                </Routes>
            </div>
        </>
    );
}

export default App;
