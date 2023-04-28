<template>
	<header>
		<div class="c-navBar">
			<RouterLink to="/" class="c-navBar_home"><LogoIcon class="c-navBar_logo"/></RouterLink>
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

<style scoped lang="scss">
.c-navBar {
	display: flex;
	max-width: 950px;
	margin: auto;
	border-bottom: var(--standard-border);

	h1 {
		font-weight: normal;
		margin: 10px 0;
	}

	nav {
		margin: auto 0 auto auto;
	}

	&_home {
		margin: auto 0;
	}

	&_logo {
		display: flex;
		width: 90px;
		height: 69px;
	}

	.c-navLinks {
		display: flex;
		font-size: 20px;

		a {
			display: flex;
			align-items: center;
			padding-left: var(--standard-spacing);
		}

		svg:hover {
			opacity: 0.7;
		}
	}
}

header {
	background-color: var(--base-background-color);
	padding: 0 2rem;
}
</style>
