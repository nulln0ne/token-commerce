import { useAuthStore } from '../../../app/stores/authStore';

export const useAuth = () => {
    return useAuthStore();
};
