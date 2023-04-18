<template>
	<header>
		<div class="c-navBar">
			<h1>primary draft</h1>
			<nav class="c-navLinks">
				<RouterLink to="/republican-primary-election">gop</RouterLink>
				<RouterLink to="/democratic-primary-election">dem</RouterLink>
				<RouterLink to="/about"><InfoIcon /></RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import InfoIcon from '../assets/icons/info.svg?component';
</script>

<style scoped>
header {
	background-color: var(--base-background-color);
	padding: 0 2rem;
}

.c-navBar {
	display: flex;
	max-width: 950px;
	margin: auto;
	border-bottom: var(--standard-border);
}

.c-navLinks {
	display: flex;
	font-size: 20px;
}

h1 {
	font-weight: normal;
	margin: 10px 0;
}

nav {
	margin: auto 0 auto auto;
}

a {
	display: flex;
	align-items: center;
	padding-left: var(--standard-spacing);
}
</style>
