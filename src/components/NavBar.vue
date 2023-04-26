<template>
	<header>
		<div class="c-navBar">
			<RouterLink to="/"><LogoIcon class="c-navLinks_logo"/></RouterLink>
			<h1>primary draft</h1>
			<nav class="c-navLinks">
				<RouterLink to="/republican-primary-map">gop</RouterLink>
				<RouterLink to="/democratic-primary-map">dem</RouterLink>
				<RouterLink to="/about"><InfoIcon /></RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import InfoIcon from '../assets/icons/info.svg?component';
import LogoIcon from '../assets/logo/logo.svg?component';
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

.c-navLinks a {
	display: flex;
	align-items: center;
	padding-left: var(--standard-spacing);
}

.c-navLinks_logo {
	display: flex;
	width: 90px;
	height: 69px;
}

.c-navLinks svg:hover {
	opacity: 0.7;
}
</style>
