<template>
	<header>
		<div class="c-navBar">
			<RouterLink :to="{ name: 'Home' }" class="c-navBar_home"><LogoIcon class="c-navBar_logo"/></RouterLink>
			<h1>primary draft</h1>

			<nav class="c-navBar_links">
				<RouterLink :to="{ name: 'Rep' }">gop</RouterLink>
				<RouterLink :to="{ name: 'Dem' }">dem</RouterLink>
				<RouterLink :to="{ name: 'About' }"><InfoIcon /></RouterLink>
			</nav>

			<nav class="c-navBar_burger"><MenuIcon @click="showMenu = !showMenu"/></nav>
			<nav
				v-show="showMenu"
				class="c-navBar_burgerLinks"
			>
				<RouterLink :to="{ name: 'Rep' }" @click="showMenu = false">
					<RepIcon class="c-navBar_burgerLinks_icon"/>Republican
				</RouterLink>
				<RouterLink :to="{ name: 'Dem' }" @click="showMenu = false">
					<DemIcon class="c-navBar_burgerLinks_icon"/>Democratic
				</RouterLink>
				<RouterLink :to="{ name: 'About' }" @click="showMenu = false">
					<InfoIcon class="c-navBar_burgerLinks_infoIcon"/>About
				</RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { RouterLink } from "vue-router";

import InfoIcon from '../assets/icons/info.svg?component';
import MenuIcon from '../assets/icons/menu.svg?component';
import DemIcon from '../assets/icons/party-logo-dem.svg?component';
import RepIcon from '../assets/icons/party-logo-rep.svg?component';
import LogoIcon from '../assets/logo/logo.svg?component';

const showMenu: Ref<boolean> = ref(false);
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-navBar {
	display: flex;
	max-width: 950px;
	margin: auto;
	border-bottom: $standard-border;

	h1 {
		font-weight: normal;
		margin: 10px 0;
	}

	nav {
		margin: auto 0 auto auto;
	}

	&_home {
		margin: auto 0;
		margin-left: -12px; // Adjust for white space in logo SVG
	}

	&_logo {
		display: flex;
		width: 90px;
		height: 69px;
	}

	&_links {
		display: flex;
		font-size: 20px;

		.router-link-active {
			text-decoration: underline;
		}

		a {
			display: flex;
			align-items: center;
			padding-left: $standard-spacing;
		}

		svg {
			width: 24px;
			height: 24px;

			&:hover {
				opacity: 0.6;
			}
		}

		@media (max-width: $screen-breakpoint-sm) {
			display: none;
		}
	}

	&_burger {
		display: flex;
		padding-top: 2px;

		svg {
			width: 32px;
			height: 32px;
			cursor: pointer;
		}

		@media (min-width: $screen-breakpoint-sm) {
			display: none;
		}
	}

	&_burgerLinks {
		z-index: 99;
		display: flex;
		flex-direction: column;
		position: absolute;
		right: -1px;
		top: 69px;
		padding: 20px 20px 0;
		background-color: $background-color-base;
		border: $standard-border;
		font-size: 24px;

		a {
			display: flex;
			align-items: center;
			margin-bottom: 20px;
		}

		&_icon {
			width: 28px;
			height: 28px;
			margin-right: 10px;
		}

		&_infoIcon {
			width: 34px;
			height: 34px;
			margin-right: 6px;
    		margin-left: -2px;
		}
	}
}

header {
	position: relative;
	background-color: $background-color-base;
	padding: 0 $large-spacing;

	@media (max-width: $screen-breakpoint-sm) {
		padding: 0 $standard-spacing;
	}
}
</style>
