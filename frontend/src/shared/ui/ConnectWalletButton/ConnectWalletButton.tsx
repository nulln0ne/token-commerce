import React, { useEffect } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { Button } from '@mui/joy';
import useAuthStore from '@/app/stores/useAuth.store';

const ConnectWalletButton: React.FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const { walletAddress, setWalletAddress, setJwtAccessToken, setJwtRefreshToken, clearAuthState } = useAuthStore();

    useEffect(() => {
        const storedWalletAddress = localStorage.getItem('walletAddress');
        if (storedWalletAddress) {
            setWalletAddress(storedWalletAddress);
        }
    }, [setWalletAddress]);

    const handleConnectWallet = async () => {
        try {
            const connectedWallets = await connect();
            if (connectedWallets.length > 0) {
                const address = connectedWallets[0].accounts[0].address;
                setWalletAddress(address);
                localStorage.setItem('walletAddress', address);
                const jwtAccessToken = 'yourAccessToken';
                const jwtRefreshToken = 'yourRefreshToken';
                setJwtAccessToken(jwtAccessToken);
                setJwtRefreshToken(jwtRefreshToken);
                localStorage.setItem('jwtAccessToken', jwtAccessToken);
                localStorage.setItem('jwtRefreshToken', jwtRefreshToken);
            }
            console.log('Connected wallets:', connectedWallets);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleDisconnectWallet = async () => {
        if (wallet) {
            await disconnect(wallet);
            clearAuthState();
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('jwtAccessToken');
            localStorage.removeItem('jwtRefreshToken');
        }
    };

    const handleButtonClick = async () => {
        if (wallet || walletAddress) {
            await handleDisconnectWallet();
        } else {
            await handleConnectWallet();
        }
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <Button onClick={handleButtonClick} disabled={connecting} variant="soft" color="warning">
            {connecting ? 'Connecting...' : walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWalletButton;
