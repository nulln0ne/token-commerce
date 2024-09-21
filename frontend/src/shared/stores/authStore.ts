import { create } from 'zustand';
import logger from '../lib/logger';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    login: (accessToken, refreshToken) => {
        logger.info('Logging in user...');
        set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
        });
        logger.info('User logged in successfully.');
    },

    logout: () => {
        logger.info('Logging out user...');
        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
        logger.info('User logged out successfully.');
    },
}));
