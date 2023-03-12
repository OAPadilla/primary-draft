<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<header>
		<div class="c-navBar">
			<h1>Primary Draft</h1>
			<nav class="c-navLinks">
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/about">About</RouterLink>
			</nav>
		</div>
	</header>
</template>

<style scoped>
header {
	background-color: #000000;
}
.c-navBar {
	color: #FFFFFF;
	display: flex;
	padding: 0 2rem;
	max-width: 950px;
	margin: auto;
}

h1 {
	font-weight: normal;
}

nav {
	margin: auto 0 auto auto;
}

a {
	color: #FFFFFF;
	padding-left: 1rem;
}
</style>
