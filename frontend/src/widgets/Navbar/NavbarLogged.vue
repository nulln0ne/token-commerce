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
import { loggedLinks } from './links';

export default defineComponent({
  name: 'NavbarLogged',
  components: { Navbar },
  setup() {
    return { links: loggedLinks };
  },
});
</script>