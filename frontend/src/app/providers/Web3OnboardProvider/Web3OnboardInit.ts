import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import metamaskSDK from '@web3-onboard/metamask';

// const INFURA_KEY = '1750a724e1f7452d8c6f90b81fdee533'

const ethereumSepolia = {
    id: 11155111,
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org/',
};

const metamaskSDKWallet = metamaskSDK({
    options: {
        extensionOnly: false,
        dappMetadata: {
            name: 'Demo Web3Onboard',
        },
    },
});

const chains = [ethereumSepolia];
const wallets = [injectedModule(), metamaskSDKWallet];

const web3Onboard = init({
    wallets,
    chains,
    appMetadata: {
        name: 'Web3-Onboard Demo',
        icon: '<svg>App Icon</svg>',
        description: 'A demo of Web3-Onboard.',
    },
});

export type Web3OnboardType = ReturnType<typeof init>;
export default web3Onboard as Web3OnboardType;
