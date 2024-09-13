import { ethers } from 'ethers';
import axiosInstance from '../../../shared/api/axios/axios';
import { useWalletConnection } from '../../../app/hooks/useWalletConnection';
import { useAuthStore } from '../../../app/stores/authStore';
import { useUserStore } from '../../../app/stores/userStore';
import { API_URL } from '../../../app/config';
import logger from '../../../shared/lib/logger';
import { handleApiError } from '../../../shared/lib/handleApiError';
import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { WalletState } from '@web3-onboard/core';

export const useAuthentication = () => {
    const { wallet, connect, disconnect } = useWalletConnection();
    const { accessToken, isAuthenticated, login, logout } = useAuthStore();
    const setWalletAddress = useUserStore((state) => state.setWalletAddress);

    const handleLogout = useCallback(async (walletAddress: string) => {
        logger.info(`Sending logout request for wallet: ${walletAddress}`);
        try {
            await axiosInstance.post(`${API_URL}/auth/logout`, { walletAddress });
            logger.info(`Logout successful for wallet: ${walletAddress}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                handleApiError(error, `Failed to log out wallet: ${walletAddress}`);
            } else {
                logger.error('Unknown error occurred during logout', error);
                throw error;
            }
        }
    }, []);

    const handleLogin = useCallback(
        async (wallet: WalletState) => {
            const walletAddress = wallet.accounts[0]?.address;
            if (!walletAddress) throw new Error('Wallet address not found');

            setWalletAddress(walletAddress);
            logger.info(`Wallet connected: ${walletAddress}`);

            try {
                const {
                    data: { nonce },
                } = await axiosInstance.post(`${API_URL}/auth/get-nonce`, {
                    walletAddress,
                });
                logger.info(`Nonce received for wallet: ${walletAddress}`);

                const provider = new ethers.providers.Web3Provider(wallet.provider);
                const signer = provider.getSigner();
                const signature = await signer.signMessage(`Sign this nonce: ${nonce}`);
                logger.info(`Signature generated for wallet: ${walletAddress}`);

                const {
                    data: { accessToken, refreshToken },
                } = await axiosInstance.post(`${API_URL}/auth`, {
                    walletAddress,
                    signature,
                });

                login(accessToken, refreshToken);
                logger.info('Authentication successful.');
            } catch (error) {
                if (error instanceof AxiosError) {
                    handleApiError(error, `Failed to authenticate wallet: ${walletAddress}`);
                } else {
                    logger.error('Unknown error occurred during authentication', error);
                    throw error;
                }
            }
        },
        [login, setWalletAddress]
    );

    const authenticate = useCallback(async () => {
        try {
            if (wallet) {
                const walletAddress = wallet.accounts[0]?.address;
                logger.info(`Disconnecting wallet: ${walletAddress}`);
                await disconnect(wallet);

                if (accessToken && walletAddress) {
                    await handleLogout(walletAddress);
                }

                logout();
                logger.info('Authentication store cleared.');
            } else {
                logger.info('Connecting wallet...');
                const connectedWallets = await connect();
                const connectedWallet = connectedWallets[0];
                if (!connectedWallet) throw new Error('No wallet connected');

                await handleLogin(connectedWallet);
            }
        } catch (error) {
            logger.error('Error during wallet connection and authentication:', error);
            throw error;
        }
    }, [wallet, accessToken, connect, disconnect, handleLogout, handleLogin, logout]);

    return { wallet, isAuthenticated, authenticate };
};
