<template>
  <div>
    <NavbarLogged />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavbarLogged from '@/widgets/Navbar/NavbarLogged.vue';

export default defineComponent({
  name: 'LayoutLogged',
  components: { NavbarLogged },
});
</script>