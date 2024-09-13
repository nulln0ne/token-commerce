import React from 'react';
import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from './Web3OnboardInit';

interface IWeb3OnboardProviderWrapperProps {
    children: React.ReactNode;
}

const Web3OnboardProviderWrapper: React.FC<IWeb3OnboardProviderWrapperProps> = ({ children }) => {
    return <Web3OnboardProvider web3Onboard={web3Onboard}>{children}</Web3OnboardProvider>;
};

export default Web3OnboardProviderWrapper;
