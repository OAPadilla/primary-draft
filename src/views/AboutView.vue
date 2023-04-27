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
					<strong>Choose a candidate</strong> to quickly allocate a majority (50.1%) of a state's popular vote with a click. Select "None" otherwise
					to keep a clean slate.
				</li>
				<li>
					<strong>Click on a U.S. state or territory</strong> on the map and experiment with the allocation tool. Delegates are automatically 
					calculated based on the set popular vote percentages and a state's election rules.
				</li>
				<li>
					<strong>Experiment with state results.</strong> Watch the "Unallocated" row to help you keep track of yet to be distributed votes. 
					Once 0 is reached, you won't be able to allocate any more to a candidate without taking away from another.
				</li>
				<li>
					<strong>Lead a candidate to victory!</strong> A candidate is the official winner once they've earned a majority of total delegates, 
					reaching the delegate chart flag under the U.S. map.
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
					The many primary types can be categorized into 2 main groups. <a href="https://www.thegreenpapers.com/Definitions.html#Prim">Learn more here</a>.
					<ul>
						<li><strong>Winner-Take-All and Winner-Take-Most</strong> - The candidate with the most amount of votes collects all of a state's delegates.</li>
						<li><strong>Proportional and Delegate Selection</strong> - Delegates are proportionally distributed based on popular vote percentiles.
					If a minimum threshold exists, a candidate must meet it to be eligible for delegates. If a winner-take-all trigger exists,
					a candidate will collect all of a state's delegates if they reach a defined threshold.</li>
					</ul>
				</li>
			</ul>
		</div>

		<div class="c-aboutView_section">
			<h2>Credits & Notes</h2>
			<p>
				Up-to-date election information sourced from <a href="https://www.TheGreenPapers.com">TheGreenPapers.com</a>.
			</p>
			<p>
				Expect more updates and improvements, including support for the Democratic Party's primary system.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta'

useMeta({
  title: 'About'
})
</script>
  
<style scoped>
.c-aboutView ul {
	padding: 0 20px;
}

.c-aboutView h2 {
	text-align: unset;
	margin-bottom: 0;
}

.c-aboutView_section {
	border-left: 1px solid black;
	padding-left: 40px;
	margin-bottom: var(--standard-spacing);
}

.c-aboutView a {
	text-decoration: none;
	color: #2f83b5;
	border-bottom: 1px solid #2f83b5;
}
</style>
  