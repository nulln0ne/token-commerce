import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import metamaskSDK from '@web3-onboard/metamask';

interface EthereumSepolia {
    id: number;
    token: string;
    label: string;
    rpcUrl: string;
}

const ethereumSepolia: EthereumSepolia = {
    id: 11155111,
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org/',
};

const metamaskSDKWallet = metamaskSDK({
    options: {
        extensionOnly: false,
    },
});

const chains = [ethereumSepolia];
const wallets = [injectedModule(), metamaskSDKWallet];

const web3Onboard = init({
    wallets,
    chains,
});

export type Web3OnboardType = ReturnType<typeof init>;
export default web3Onboard as Web3OnboardType;
