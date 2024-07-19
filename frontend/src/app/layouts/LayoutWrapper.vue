<template>
  <div>
    <LayoutLogged v-if="isAuthenticated" />
    <LayoutUnlogged v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useUserStore } from '@/app/stores/userStore';
import { PLACEHOLDER_AUTH } from '@/app/config';
import LayoutLogged from '@/app/layouts/LayoutLogged.vue';
import LayoutUnlogged from '@/app/layouts/LayoutUnlogged.vue';

export default defineComponent({
  name: 'LayoutWrapper',
  components: { LayoutLogged, LayoutUnlogged },
  setup() {
    const userStore = useUserStore();
    const isAuthenticated = computed(() => userStore.isAuthenticated || PLACEHOLDER_AUTH);
    
    return { isAuthenticated };
  },
});
</script>
