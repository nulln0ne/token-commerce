import React from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import Button from '@/shared/ui/Button/Button';

const ConnectWalletButton: React.FC = () => {
    const [
        {
            wallet,
            connecting,
        },
        connect,
    ] = useConnectWallet();

    const handleConnectWallet = async () => {
        try {
            const connectedWallets = await connect();
            console.log('Connected wallets:', connectedWallets);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    return (
        <Button onClick={handleConnectWallet} disabled={connecting || !!wallet}>
            {connecting ? 'Connecting...' : wallet ? 'Wallet Connected' : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWalletButton;
