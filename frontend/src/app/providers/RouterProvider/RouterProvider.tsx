import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from '@/pages/MainPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

interface RouterProviderProps {
    children?: React.ReactNode;
}

const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {children}
        </Router>
    );
};

export default RouterProvider;
