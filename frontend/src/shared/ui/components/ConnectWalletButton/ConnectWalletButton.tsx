import React from 'react';
import { Button } from '@mui/joy';
import { truncateString } from '../../../lib/truncateString';
import { useAuthentication } from '../../../../features/auth/hooks/useAuthentication';
import logger from '../../../../shared/lib/logger';
import { useState } from 'react';

const ConnectWalletButton: React.FC = () => {
    const { wallet, authenticate } = useAuthentication();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        try {
            await authenticate();
        } catch (error) {
            logger.error('Error during wallet connection/disconnection:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <Button onClick={handleConnectWallet} disabled={isConnecting} variant="outlined" color="warning">
            {wallet ? truncateString(wallet.accounts[0]?.address || '', 6, 4) : 'Connect Wallet'}
        </Button>
    );
};

export default React.memo(ConnectWalletButton);
