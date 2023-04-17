<template>
	<header>
		<div class="c-navBar">
			<h1>primary draft</h1>
			<nav class="c-navLinks">
				<RouterLink to="/">home</RouterLink>
				<RouterLink to="/about">about</RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
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
	border-bottom: 1px solid #E9141D;
}

h1 {
	font-weight: normal;
}

nav {
	margin: auto 0 auto auto;
}

a {
	padding-left: 1rem;
}
</style>
