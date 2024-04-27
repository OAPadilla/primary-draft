<template>
	<div class="c-comingSoonView">
		<h1>{{ $t('comingSoon') }}</h1>
	</div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({ 
	meta: [
		{ name: 'robots', content: 'noindex' }
	]
});
</script>