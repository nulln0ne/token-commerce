import { defineStore } from 'pinia';
import type { User } from '@/entities/user/model';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    login(userData: User) {
      this.user = userData;
      this.isAuthenticated = true;
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
