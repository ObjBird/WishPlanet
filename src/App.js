import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import WishPlanetPage from './pages/WishPlanetPage';
import { Web3Provider } from './context/Web3Context';

function App() {
    const [showAddWishModal, setShowAddWishModal] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const handleAddWish = () => {
        setShowAddWishModal(true);
    };

    const handleCloseAddWish = () => {
        setShowAddWishModal(false);
    };

    const handleToggleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    return (
        <Web3Provider>
            <div className="app">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={
                            <Layout 
                                onAddWish={handleAddWish} 
                                showLeaderboard={showLeaderboard}
                                onToggleLeaderboard={handleToggleLeaderboard}
                            />
                        }>
                            <Route index element={
                                <WishPlanetPage
                                    showAddWishModal={showAddWishModal}
                                    onCloseAddWish={handleCloseAddWish}
                                    showLeaderboard={showLeaderboard}
                                />
                            } />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </div>
        </Web3Provider>
    );
}

export default App; 