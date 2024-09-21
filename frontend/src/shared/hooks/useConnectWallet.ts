import { useState } from 'react';
import { useAuthentication } from '../../features/auth/hooks/useAuthentication';
import logger from '../lib/logger';

export const useConnectWallet = () => {
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

    return { wallet, handleConnectWallet, isConnecting };
};
