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
					<!-- Bluesky -->
					<SocialShareButton
						:label="$t('share')"
						:title="$t('shareTo', { 'site': 'Bluesky' })"
						:url="`https://bsky.app/intent/compose?text=${encodedMessage}%20${encodedUrl}`"
					>
						<BlueskyIcon />
					</SocialShareButton>

					<!-- Twitter -->
					<SocialShareButton
						:label="$t('share')"
						:title="$t('shareTo', { 'site': 'X/Twitter' })"
						:url="`https://x.com/share?url=${encodedUrl}&text=${encodedMessage}`"
					>
						<TwitterIcon />
					</SocialShareButton>

					<!-- Facebook -->
					<SocialShareButton
						:label="$t('share')"
						:title="$t('shareTo', { 'site': 'Facebook' })"
						:url="`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`"
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
import { useI18n } from 'vue-i18n';

import BlueskyIcon from '../assets/icons/social-bluesky.svg?component';
import FacebookIcon from '../assets/icons/social-facebook.svg?component';
import LogoIcon from '../assets/logo/logo.svg?component';
import TwitterIcon from '../assets/icons/social-twitter.svg?component';
import SocialShareButton from './SocialShareButton.vue';

const { t } = useI18n();

const encodedMessage: string = encodeURIComponent(t('usaFlagEmoji'));
const encodedUrl: string = encodeURIComponent(t('canonicalUrl'));
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
