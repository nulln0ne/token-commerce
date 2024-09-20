import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../../widgets/Navbar/Navbar';
import { useAuthStore } from '../../shared/stores/authStore';
import { Box } from '@mui/joy';

const LoggedInLayout: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
        </Box>
    );
};

export default LoggedInLayout;
