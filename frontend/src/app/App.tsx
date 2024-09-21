import React from 'react';
import Providers from './providers/Providers';
import { GlobalStyles } from '@mui/system';
import { CssBaseline } from '@mui/joy';

const App: React.FC = () => {
    return (
        <>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    body: {
                        margin: 0,
                        padding: 0,
                        backgroundColor: '#e6e6e6',
                        color: '#222',
                        fontFamily: 'Inter',
                    },
                }}
            />
            <Providers />
        </>
    );
};

export default App;
