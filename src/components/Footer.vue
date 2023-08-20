<template>
	<footer>
		<div class="c-footer">
			<!-- Contact -->
			<div class="c-footer_top">
				<div class="c-footer_contact">
					<div class="c-footer_contactTitle">Contact</div>
					<div class="c-footer_contactEmail">info@PrimaryDraft.com</div>
				</div>

				<!-- Social Share -->
				<!-- <div class="c-footer_share">Share</div> -->
			</div>

			<LogoIcon class="c-footer_logo"/>

			<!-- Copyright -->
			<div class="c-footer_copyright">
				<div>© 2023 Oscar Padilla</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import LogoIcon from '../assets/logo/logo.svg?component';
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-footer {
	display: flex;
	padding: 20px 0 30px;
	flex-direction: column;
	max-width: 950px;
	margin: auto;
	border-top: $standard-border;
	font-size: 12px;

	h4 {
		font-size: 12px;
		font-weight: normal;
		margin: 0;
	}

	&_top {
		display: flex;
	}

	&_share {
		margin-left: auto;
	}

	&_contactTitle {
		padding-bottom: 5px;
		font-weight: bold;
	}

	&_contactEmail {
		color: grey;
	}

	&_logo {
		margin: auto;
		width: 90px;
		height: 69px;
	}

	&_copyright {
		margin: auto;
	}
}

footer {
	background-color: $background-color-base;
	padding: 0 $large-spacing;

	@media (max-width: $screen-breakpoint-sm) {
		padding: 0 $standard-spacing;
	}
}
</style>
