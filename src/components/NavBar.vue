<template>
	<header>
		<div class="c-navBar">
			<RouterLink :to="{ name: 'Home' }" class="c-navBar_home">
				<LogoIcon class="c-navBar_logo"/>
				<h1 class="c-navBar_title">{{ $t('siteName') }}</h1>
			</RouterLink>

			<nav class="c-navBar_links">
				<RouterLink
					:to="{ name: 'Dem' }"
					:aria-label="$t('partyNames.democratic.full')"
					:title="$t('partyMap', { 'party': $t('partyNames.democratic.full') })"
				>
					{{ $t('partyNames.democratic.abbr') }}
				</RouterLink>
				<RouterLink
					:to="{ name: 'Rep' }"
					:aria-label="$t('partyNames.republican.full')"
					:title="$t('partyMap', { 'party': $t('partyNames.republican.full') })"
				>
					{{ $t('partyNames.republican.abbr') }}
				</RouterLink>
				<RouterLink
					:to="{ name: 'About' }"
					:aria-label="$t('about')"
				>
					<InfoIcon />
				</RouterLink>
			</nav>

			<nav class="c-navBar_burger"><MenuIcon @click="showMenu = !showMenu"/></nav>
			<Transition name="slide">
				<nav
					v-show="showMenu"
					class="c-navBar_burgerLinks"
				>
					<RouterLink
						:to="{ name: 'Dem' }"
						:aria-label="$t('partyNames.democratic.full')"
						:title="$t('partyMap', { 'party': $t('partyNames.democratic.full') })"
						@click="showMenu = false"
					>
						<DemIcon class="c-navBar_burgerLinks_icon"/>{{ $t('partyNames.democratic.full') }}
					</RouterLink>
					<RouterLink
						:to="{ name: 'Rep' }"
						:aria-label="$t('partyNames.republican.full')"
						:title="$t('partyMap', { 'party': $t('partyNames.republican.full') })"
						@click="showMenu = false"
					>
						<RepIcon class="c-navBar_burgerLinks_icon"/>{{ $t('partyNames.republican.full') }}
					</RouterLink>
					<RouterLink
						:to="{ name: 'About' }"
						:aria-label="$t('about')"
						@click="showMenu = false"
					>
						<InfoIcon class="c-navBar_burgerLinks_infoIcon"/>{{ $t('about') }}
					</RouterLink>
				</nav>
			</Transition>
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
	@include vue-slide-x(0.2, 200);

	display: flex;
	max-width: $page-width-standard;
	margin: auto;
	border-bottom: $border-standard;

	&_title {
		text-transform: lowercase;
		font-weight: normal;
		margin: 10px 0;
	}

	nav {
		margin: auto 0 auto auto;
	}

	&_home {
		display: flex;
		margin: auto 0;
		margin-left: -12px; // Adjust for white space in logo SVG

		&:hover {
			text-decoration: none;
		}
	}

	&_logo {
		display: flex;
		width: 90px;
		height: 69px;
	}

	&_links {
		display: flex;
		font-size: $font-size-l;

		.router-link-active {
			text-decoration: underline;
		}

		a {
			display: flex;
			align-items: center;
			padding-left: $spacing-standard;
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
		right: 0;
		top: 69px;
		padding: $spacing-standard $spacing-standard 0;
		background-color: $background-color-base;
		border: $border-standard;
		border-right: none;
		font-size: $font-size-xl;

		a {
			display: flex;
			align-items: center;
			margin-bottom: $spacing-standard;
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
	padding: 0 $spacing-lg;

	@media (max-width: $screen-breakpoint-sm) {
		padding: 0 $spacing-standard;
	}
}
</style>
