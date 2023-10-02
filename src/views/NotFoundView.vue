<template>
    <div class="c-notFoundView">
        <h1>Page Not Found</h1>
    </div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';

useMeta({
    title: 'Not Found',
	meta: [
		{ name: 'robots', Name: 'robots', content: 'noindex' }
	]
});
</script>