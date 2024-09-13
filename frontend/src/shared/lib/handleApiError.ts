import { AxiosError } from 'axios';

export const handleApiError = (error: AxiosError, message: string) => {
    console.error(`${message}:`, error?.response?.data || error.message);
    throw error;
};
