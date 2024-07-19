import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/app/stores/userStore';
import LayoutWrapper from '@/app/layouts/LayoutWrapper.vue';
import MainView from '@/pages/MainView.vue';
import BalanceView from '@/pages/BalanceView.vue';
import TransactionView from '@/pages/TransactionView.vue';
import NotFoundView from '@/pages/NotFoundView.vue';

import { PLACEHOLDER_AUTH } from '@/app/config';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LayoutWrapper,
    children: [
      { path: '', component: MainView },
      { path: 'balance', component: BalanceView },
      { path: 'transaction', component: TransactionView },
      { path: ':pathMatch(.*)*', component: NotFoundView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !(userStore.isAuthenticated || PLACEHOLDER_AUTH)) {
    return next('/');
  }

  next();
});

export default router;
