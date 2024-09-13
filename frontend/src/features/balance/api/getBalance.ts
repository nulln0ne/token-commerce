import { useUserStore } from '../../../app/stores/userStore';
import axiosInstance from '../../../shared/api/axios/axios';
import { handleApiError } from '../../../shared/lib/handleApiError';
import { AxiosError } from 'axios';

export const getBalance = async (walletAddress: string) => {
    try {
        const response = await axiosInstance.get(`/users/balance/${walletAddress}`);
        useUserStore.getState().setBalance(response.data.balance);
        return response.data.balance;
    } catch (error) {
        if (error instanceof AxiosError) {
            handleApiError(error, 'Error fetching balance');
        } else {
            console.error('Unknown error occurred', error);
            throw error;
        }
    }
};
