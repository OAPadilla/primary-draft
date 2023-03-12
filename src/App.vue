<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <NavBar />
  <div class="content">
    <RouterView />
  </div>
  <Footer />
</template>

<style scoped>
.content {
  flex:1;
  max-width: 950px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>
