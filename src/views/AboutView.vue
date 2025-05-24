<template>
	<div class="c-aboutView">
		<div class="c-aboutView_section">
			<p>{{ $t('aboutPage.aboutContent') }}</p>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.howToUseSection.title') }}</h2>
			<ol>
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
			</ol>
		</div>

		<div class="c-aboutView_section">
			<h2>{{ $t('aboutPage.limitationsSection.title') }}</h2>
			<p>{{ $t('aboutPage.limitationsSection.content.p') }}</p>
			<ul>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item1`) }}
					<a :href="usaGovLink">{{ $t(`learnMore`) }}</a>
				</li>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item2`) }}
					<a :href="ballotpediaLink">{{ $t(`learnMore`) }}</a>
				</li>
				<li>
					{{ $t(`aboutPage.limitationsSection.content.item3`) }}
					<a :href="theGreenPapersDefsLink">{{ $t(`learnMore`) }}</a>
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
	</div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import FlagIcon from '../assets/icons/flag.svg?component';

useSeoMeta({
  title: 'About'
});

const ballotpediaLink: string = 'https://ballotpedia.org/Types_of_delegates';
const theGreenPapersDefsLink: string = 'https://www.thegreenpapers.com/Definitions.html#Prim';
const usaGovLink: string = 'https://www.usa.gov/primaries-caucuses';
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-aboutView {
	ul {
		padding: 0 $spacing-standard;
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
		border: $border-standard;
		padding: $spacing-standard;
		border-radius: 20px;
		margin-bottom: $spacing-standard;
	}

	&_flag {
		stroke: $color-black;
		width: 16px;
		height: 16px;
	}
}
</style>
  