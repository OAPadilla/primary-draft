<template>
	<div class="c-aboutView">
		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.aboutSection.title') }}</h2>
			<p>{{ $t('aboutPage.aboutSection.content') }}</p>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.whatIsAPrimarySection.title') }}</h2>
			<p>{{ $t('aboutPage.whatIsAPrimarySection.content') }}</p>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.howToUseSection.title') }}</h2>
			<ul>
				<template v-for="i in 4">
					<i18n-t :keypath="`aboutPage.howToUseSection.content.item${i}`" tag="li">
						<template #lead>
							<strong>{{ $t(`aboutPage.howToUseSection.content.item${i}Lead`) }}</strong>
						</template>
						<template #flagIcon>
							<FlagIcon class="c-aboutView_flag" />
						</template>
					</i18n-t>
				</template>
			</ul>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.limitationsSection.title') }}</h2>
			<p>{{ $t('aboutPage.limitationsSection.content.p') }}</p>
			<ul>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item1`) }}
					<a :href="usaGovLink">{{ $t(`learnMoreHere`) }}</a>.
				</li>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item2`) }}
					<a :href="ballotpediaLink">{{ $t(`learnMoreHere`) }}</a>.
				</li>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item3`) }}
					<a :href="theGreenPapersDefsLink">{{ $t(`learnMoreHere`) }}</a>.
					<ul>
						<i18n-t keypath="aboutPage.limitationsSection.content.item3a" tag="li">
							<template #lead>
								<strong>{{ $t('aboutPage.limitationsSection.content.item3aLead') }}</strong>
							</template>
						</i18n-t>
						<i18n-t keypath="aboutPage.limitationsSection.content.item3b" tag="li">
							<template #lead>
								<strong>{{ $t('aboutPage.limitationsSection.content.item3bLead') }}</strong>
							</template>
						</i18n-t>
					</ul>
				</li>
			</ul>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.creditsSection.title') }}</h2>
			<i18n-t keypath="aboutPage.creditsSection.content.item1" tag="p">
				<template #sourceA>
					<a :href="theGreenPapersLink">{{ $t('aboutPage.creditsSection.content.item1sourceA') }}</a>
				</template>
				<template #sourceB>
					<a :href="frontLoadingHQLink">{{ $t('aboutPage.creditsSection.content.item1sourceB') }}</a>
				</template>
			</i18n-t>
			<p>{{ $t('aboutPage.creditsSection.content.item2') }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import FlagIcon from '../assets/icons/flag.svg?component';

useMeta({
  title: 'About'
});

const ballotpediaLink: string = 'https://ballotpedia.org/Types_of_delegates';
const frontLoadingHQLink: string = 'https://www.frontloadinghq.com';
const theGreenPapersLink: string = 'https://www.TheGreenPapers.com';
const theGreenPapersDefsLink: string = 'https://www.thegreenpapers.com/Definitions.html#Prim';
const usaGovLink: string = 'https://www.usa.gov/primaries-caucuses';
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-aboutView {
	ul {
		padding: 0 20px;
	}

	h2 {
		text-align: unset;
		margin: 0;
	}

	a {
		text-decoration: none;
		color: #2f83b5;
		border-bottom: 1px solid #2f83b5;
	}

	&_section {
		border-left: $standard-border;
		padding-left: 40px;
		margin-bottom: $standard-spacing;
	}

	&_flag {
		stroke: $color-black;
		width: 16px;
		height: 16px;
	}
}
</style>
  