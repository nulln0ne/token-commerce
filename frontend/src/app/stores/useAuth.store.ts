import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    walletAddress: string | null;
    jwtAccessToken: string | null;
    jwtRefreshToken: string | null;
    setWalletAddress: (walletAddress: string | null) => void;
    setJwtAccessToken: (jwtAccessToken: string | null) => void;
    setJwtRefreshToken: (jwtRefreshToken: string | null) => void;
    clearAuthState: () => void;
}

const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            walletAddress: null,
            jwtAccessToken: null,
            jwtRefreshToken: null,
            setWalletAddress: (walletAddress) => set({ walletAddress }),
            setJwtAccessToken: (jwtAccessToken) => set({ jwtAccessToken }),
            setJwtRefreshToken: (jwtRefreshToken) => set({ jwtRefreshToken }),
            clearAuthState: () => set({ walletAddress: null, jwtAccessToken: null, jwtRefreshToken: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export default useAuthStore;
