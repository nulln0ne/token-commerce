import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/joy';

const LoggedOutLayout: React.FC = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <main>
                <Outlet />
            </main>
        </Box>
    );
};

export default LoggedOutLayout;
