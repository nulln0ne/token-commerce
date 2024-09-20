import { useUserStore } from '../stores/userStore';
import { handleApiError } from '../lib/handleApiError';
import { AxiosError } from 'axios';
import axiosInstance from '../lib/axios';

export class BalanceService {
    public async getBalance(walletAddress: string): Promise<void> {
        try {
            const { data } = await axiosInstance.get(`/users/balance/${walletAddress}`);
            useUserStore.getState().setBalance(data.balance);
        } catch (error) {
            if (error instanceof AxiosError) {
                handleApiError(error, 'Error fetching balance');
            } else {
                console.error('Unknown error occurred', error);
                throw error;
            }
        }
    }
}
