<template>
	<div class="c-comingSoonView">
		<h1>{{ $t('comingSoon') }}</h1>
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';

useMeta({ 
	meta: [
		{ name: 'robots', Name: 'robots', content: 'noindex' }
	]
});
</script>