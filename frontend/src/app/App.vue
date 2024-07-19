<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LayoutUnlogged from '@/app/layouts/LayoutUnlogged.vue';
import LayoutLogged from '@/app/layouts/LayoutLogged.vue';

const route = useRoute();

const layoutComponent = computed(() => {
  if (route.meta.layout === 'logged') {
    return LayoutLogged;
  } else {
    return LayoutUnlogged;
  }
});
</script>
