import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Nav.jsx';
import Home from './components/Home/Home.jsx';
import Explore from './components/Explore/Explore.jsx';

const App = () => {
    const BASE_URL = '';
    const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

    return (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                
                {/* Catch-all route for 404 handling */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;