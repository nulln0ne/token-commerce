import React from 'react';
import { RouterProvider } from '@/app/providers/RouterProvider';
import { Web3OnboardProvider } from '@/app/providers/Web3OnboardProvider';

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <Web3OnboardProvider>
            <RouterProvider>{children}</RouterProvider>
        </Web3OnboardProvider>
    );
};

export default Providers;
