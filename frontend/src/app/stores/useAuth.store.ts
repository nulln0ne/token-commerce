import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { ethers } from 'ethers';

interface AuthState {
    walletAddress: string | null;
    isAuthenticated: boolean;
    connectWallet: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    logout: () => void;
}

type AuthStateCreator = StateCreator<AuthState, [], [], AuthState>;

export const useAuthStore = create<AuthState>(
    (persist as unknown as (config: AuthStateCreator, options: PersistOptions<AuthState>) => AuthStateCreator)(
        (set, get) => ({
            walletAddress: null,
            isAuthenticated: false,

            connectWallet: async () => {
                if (!window.ethereum) {
                    alert('Please install MetaMask!');
                    return;
                }

                try {
                    const ethereumProvider = window.ethereum as unknown;
                    const provider = new ethers.providers.Web3Provider(
                        ethereumProvider as ethers.providers.ExternalProvider,
                    );
                    await provider.send('eth_requestAccounts', []);
                    const signer = provider.getSigner();
                    const walletAddress = await signer.getAddress();

                    set({ walletAddress, isAuthenticated: true });
                } catch (error) {
                    console.error('Failed to connect wallet:', error);
                }
            },

            signMessage: async (message: string) => {
                if (!get().isAuthenticated || !get().walletAddress) {
                    throw new Error('Wallet is not connected');
                }

                try {
                    const ethereumProvider = window.ethereum as unknown;
                    const provider = new ethers.providers.Web3Provider(
                        ethereumProvider as ethers.providers.ExternalProvider,
                    );
                    const signer = provider.getSigner();
                    const signature = await signer.signMessage(message);
                    return signature;
                } catch (error) {
                    console.error('Failed to sign message:', error);
                    throw error;
                }
            },

            logout: () => {
                set({ walletAddress: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        },
    ),
);
