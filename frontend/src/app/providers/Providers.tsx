import React from 'react';
import { RouterProvider } from './RouterProvider';
import { Web3OnboardProvider } from './Web3OnboardProvider';

const Providers: React.FC = () => {
    return (
        <Web3OnboardProvider>
            <RouterProvider />
        </Web3OnboardProvider>
    );
};

export default Providers;
