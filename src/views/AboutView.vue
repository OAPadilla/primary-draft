<template>
	<div class="c-aboutView">
		<div class="c-aboutView_section">
			<h2>About Primary Draft</h2>
			<p>
				Primary Draft is an interactive web app for simulating U.S. political party primary elections. Experiment with state
				primary election results and allocate delegates among presidential primary candidates on a United States map. Use it 
				as an educational tool and experience democracy!
			</p>
		</div>

		<div class="c-aboutView_section">
			<h2>What is a primary election?</h2>
			<p>
				A primary election is how a national political party selects a nominee to run for the United States 
				presidency. While a national party oversees and sets rules for elections, state's can have their own nuanced
				delegate allocation process.
			</p>
		</div>

		<div class="c-aboutView_section">
			<h2>How to use</h2>
			<ul>
				<li>
					<strong>Choose a candidate or select "None".</strong> Selecting a candidate allows you to quickly allocate a majority (50.1%) of a 
					state's popular vote with a click. "None" allows you to allocate with total freedom.
				</li>
				<li>
					<strong>Click on a U.S. state or territory</strong> on the map and interact with the allocation tool. Delegates are 
					automatically calculated based on the set popular vote percentages and a state's election rules.
				</li>
				<li>
					<strong>Experiment further with state results.</strong> Watch the "Unallocated" row to help you keep track of yet to be distributed votes. 
					Once 0 is reached, you won't be able to allocate any more to a candidate without taking away from another.
				</li>
				<li>
					<strong>Lead a candidate to victory!</strong> A candidate is the nomination winner once they've earned a majority of total delegates, 
					marked by the delegate count flag <FlagIcon class="c-aboutView_flag" />.
				</li>
			</ul>
		</div>

		<div class="c-aboutView_section">
			<h2>Limitations</h2>
			<p>
				There's a balance to be made between streamlining the user experience while retaining the authenticity of simulating an election 
				process due to the nuance of state election laws. Here are some changes we've made.
			</p>
			<ul>
				<li>
					We allocate delegates in caucuses as if they were primaries. 
					<a href="https://www.usa.gov/primaries-caucuses">Learn more here</a>.
				</li>
				<li>
					We allocate district level and soft delegates as if they were state-wide, at-large, hard delegates. 
					<a href="https://ballotpedia.org/Types_of_delegates">Learn more here</a>.
				</li>
				<li>
					We condense primary types into 2 main groups. <a href="https://www.thegreenpapers.com/Definitions.html#Prim">Learn more here</a>.
					<ul>
						<li><strong>Winner-Take-All and Winner-Take-Most</strong> - We allocate all of a state's delegates to the candidate with the most amount of votes.</li>
						<li><strong>Proportional and Delegate Selection</strong> - We distribute delegates proportionally based on the popular vote percentiles.</li>
					</ul>
				</li>
			</ul>
		</div>

		<div class="c-aboutView_section">
			<h2>Credits & Notes</h2>
			<p>
				Up-to-date election information sourced from <a href="https://www.TheGreenPapers.com">The Green Papers</a> and <a href="https://www.frontloadinghq.com/">Front Loading HQ</a>.
			</p>
			<p>
				Expect more updates and improvements.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import FlagIcon from '../assets/icons/flag.svg?component';

useMeta({
  title: 'About'
});
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-aboutView {
	ul {
		padding: 0 20px;
	}

	h2 {
		text-align: unset;
		margin-bottom: 0;
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
  