<template>
    <div class="c-notFoundView">
        <h1>Page Not Found</h1>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
    title: 'Not Found',
	meta: [
		{ name: 'robots', content: 'noindex' }
	]
});
</script>