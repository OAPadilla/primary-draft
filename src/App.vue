<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | ${metaSiteName}` : metaSiteName }}</template>
  </metainfo>

  <NavBar />
  <main class="content">
    <RouterView />
  </main>
  <Footer />
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import { RouterView } from "vue-router";
import { useI18n } from 'vue-i18n';

import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

import { useUsStatesStore } from './stores/usStates';

const { t } = useI18n();
const { fetchStatesData } = useUsStatesStore();
 
const metaCanonical: string = t('canonicalUrl');
const metaDescription: string = t('meta.description');
const metaImage: string = t('meta.image');
const metaSiteName: string = t('siteName');
const metaTitle: string = t('meta.title');

fetchStatesData();

useMeta({
  description: metaDescription,
  title: metaTitle,
  htmlAttrs: { lang: 'en', amp: true },
  link: [
    { rel: 'canonical', href: metaCanonical }
  ],
  meta: [
    { name: 'robots', Name: 'robots', content: 'index,follow' },
    // CSP
    { 'http-equiv': 'Content-Security-Policy', content: "default-src 'none'; script-src 'self' 'unsafe-eval' https://d3js.org; connect-src 'self' https://d3js.org https://gist.githubusercontent.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://d3js.org; base-uri 'self'; form-action 'self'; manifest-src 'self'" },
    // OpenGraph data
    { property: 'og:title', content: metaTitle },
    { property: 'og:site_name', content: metaSiteName },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: metaCanonical },
    { property: 'og:image', content: metaImage },
    { property: 'og:description', content: metaDescription },
    // Twitter card
    { name: 'twitter:card', Name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', Name: 'twitter:site', content: metaSiteName },
    { name: 'twitter:title', Name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', Name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image', Name: 'twitter:image', content: metaImage },
    // Google / Schema.org markup
    { itemprop: 'name', content: metaTitle },
    { itemprop: 'description', content: metaDescription },
    { itemprop: 'image', content: metaImage }
  ]
});
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.content {
  flex: 1;
  max-width: $page-width-standard;
  margin: $spacing-lg auto;
  padding: 0 $spacing-lg;

  @media (max-width: $screen-breakpoint-lg) {
    @media (min-width: $screen-breakpoint-sm) {
      min-width: 90%;
    }
  }

  @media (max-width: $screen-breakpoint-sm) {
    padding: 0 $spacing-standard;
  }
}
</style>
