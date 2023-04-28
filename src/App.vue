<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | ${metaSiteName}` : metaSiteName }}</template>
  </metainfo>

  <NavBar />
  <div class="content">
    <RouterView />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import { RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

import { useUsStatesStore } from './stores/usStates';

const { fetchStatesData } = useUsStatesStore();

const metaCanonical: string = 'https://www.primarydraft.com';
const metaDescription: string = 'Primary Draft is an interactive web app for simulating U.S. political party primary elections. Experiment with state primary election results and allocate delegates among presidential primary candidates on a United States map. Use it as an educational tool and experience democracy!';
const metaImage: string = 'https://www.primarydraft.com/primary-draft-logo.png';
const metaSiteName: string = 'Primary Draft';
const metaTitle: string = 'Interactive Primary Election Map';

fetchStatesData();

useMeta({
  description: metaDescription,
  title: metaTitle,
  htmlAttrs: { lang: 'en', amp: true },
  link: [
    { rel: 'canonical', href: metaCanonical }
  ],
  meta: [
    // CSP
    { 'http-equiv': 'Content-Security-Policy', content: "default-src 'none'; script-src 'self' 'unsafe-eval' https://d3js.org; connect-src 'self' https://d3js.org https://gist.githubusercontent.com; img-src 'self'; style-src 'self' 'unsafe-inline' https://d3js.org; base-uri 'self'; form-action 'self'; manifest-src 'self'" },
    // OpenGraph data
    { property: 'og:title', content: metaTitle },
    { property: 'og:site_name', content: metaSiteName },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: metaCanonical },
    { property: 'og:image', content: metaImage },
    { property: 'og:description', content: metaDescription },
    // Twitter card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: metaSiteName },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image:src', content: metaImage },
    // Google / Schema.org markup
    { itemprop: 'name', content: metaTitle },
    { itemprop: 'description', content: metaDescription },
    { itemprop: 'image', content: metaImage }
  ]
});
</script>

<style scoped>
.content {
  flex: 1;
  max-width: 950px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>
