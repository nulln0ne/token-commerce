import { create } from 'zustand';

interface AuthState {
    wallet: string | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    setWallet: (wallet: string) => void;
    setAuthTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    wallet: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,

    setWallet: (wallet) => set({ wallet }),
    setAuthTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, isAuthenticated: true }),
    clearAuth: () => set({ wallet: null, isAuthenticated: false, accessToken: null, refreshToken: null }),
}));

export default useAuthStore;
