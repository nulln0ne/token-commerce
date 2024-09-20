import { create } from 'zustand';

interface UserState {
    balance: number | null;
    walletAddress: string | null;
    setWalletAddress: (address: string) => void;
    setBalance: (balance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
    balance: null,
    walletAddress: null,
    setWalletAddress: (address: string) => set({ walletAddress: address }),
    setBalance: (balance: number) => set({ balance }),
}));
