<template>
	<footer>
		<div class="c-footer">
			<!-- Contact -->
			<div class="c-footer_top">
				<div class="c-footer_contact">
					<div class="c-footer_contactTitle">{{ $t('footer.contact') }}</div>
					<div class="c-footer_contactEmail">{{ $t('footer.contactEmail') }}</div>
				</div>

				<!-- Social Share -->
				<div class="c-footer_share">
					<SocialShareButton
						backgroundColor="#1DA1F2"
						:label="$t('share')"
						url="https://twitter.com/share?url=https%3A%2F%2Fwww.primarydraft.com"
					>
						<TwitterIcon />
					</SocialShareButton>

					<SocialShareButton
						backgroundColor="#316FF6"
						:label="$t('share')"
						url="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.primarydraft.com"
					>
						<FacebookIcon />
					</SocialShareButton>
				</div>
			</div>

			<LogoIcon class="c-footer_logo"/>

			<!-- Copyright -->
			<div class="c-footer_copyright">
				<div>{{ $t('footer.copyright', { 'year': new Date().getFullYear() }) }}</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import FacebookIcon from '../assets/icons/facebook.svg?component';
import LogoIcon from '../assets/logo/logo.svg?component';
import TwitterIcon from '../assets/icons/twitter.svg?component';
import SocialShareButton from './SocialShareButton.vue';
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-footer {
	display: flex;
	padding: $spacing-standard 0 30px;
	flex-direction: column;
	max-width: $page-width-standard;
	margin: auto;
	border-top: $border-standard;
	font-size: $font-size-xs;

	h4 {
		font-size: $font-size-xs;
		font-weight: normal;
		margin: 0;
	}

	&_top {
		display: flex;
	}

	&_share {
		display: flex;
		height: min-content;
		margin-left: auto;
		gap: 8px;
	}

	&_contactTitle {
		padding-bottom: 5px;
		font-weight: bold;
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
	padding: 0 $spacing-lg;

	@media (max-width: $screen-breakpoint-sm) {
		padding: 0 $spacing-standard;
	}
}
</style>
