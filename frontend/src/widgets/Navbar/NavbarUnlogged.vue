<template>
  <Navbar>
    <ul>
      <li v-for="link in links" :key="link.path">
        <router-link :to="link.path">{{ link.name }}</router-link>
      </li>
    </ul>
  </Navbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './Navbar.vue';
import { unloggedLinks } from './links';

export default defineComponent({
  name: 'NavbarUnlogged',
  components: { Navbar },
  setup() {
    return { links: unloggedLinks };
  },
});
</script>