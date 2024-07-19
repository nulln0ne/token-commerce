<template>
  <div>
    <NavbarUnlogged />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavbarUnlogged from '@/widgets/Navbar/NavbarUnlogged.vue';

export default defineComponent({
  name: 'LayoutUnlogged',
  components: { NavbarUnlogged },
});
</script>