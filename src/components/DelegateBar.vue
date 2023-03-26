<script setup lang="ts">
import { onMounted } from 'vue';
import * as d3 from 'd3';
import { storeToRefs } from 'pinia';

import { useCandidatesStore, ICandidate } from '../stores/candidates';

const candidatesStore = useCandidatesStore();
const { candidates } = storeToRefs(candidatesStore);

const className: string = 'c-delegateBar';
const totalDelegates: number = 500;

candidatesStore.$subscribe(() => {
	updateBar(Array.from(candidates.value));
});

/**
 * Sorts candidate data in descending order of delegate amount
 * 
 * @param d 
 */
function sortData(d: ICandidate[]) {
	d.sort((a: ICandidate, b: ICandidate) => {
		return b.delegates - a.delegates;
	});

	return d;
}

/**
 * Prepare candidate data for use in bar chart
 * 
 * @param data
 * @param totalDelegates 
 */
function processData(data: ICandidate[], totalDelegates: number) {
	const percent = d3.scaleLinear().domain([0, totalDelegates]).range([0, 100]);
	let cumulativeDelegates = 0; // Keeps track of how many delegates assigned as we iterate over data

	// Filter and format data for D3
	const procData = data.map((d: ICandidate) => {
		cumulativeDelegates += d.delegates
	
		return {
			id: d.id,
			delegates: d.delegates,
			color: d.color,
			cumulative: cumulativeDelegates - d.delegates,
			name: d.name,
			percent: percent(d.delegates / totalDelegates)
		}
	}).filter((d: any) => d.delegates > 0)

	// Empty space
	const leftoverDelegates = totalDelegates - cumulativeDelegates;
	procData.push({
		id: procData.length,
		delegates: leftoverDelegates, 
		color: '#e8e8e8', 
		cumulative: cumulativeDelegates,
		name: 'empty',
		percent: percent(leftoverDelegates / totalDelegates)
	})

	return procData
};

/**
 * Update bar chart rect sizes based on new data
 * 
 * @param data
 */
function updateBar(data: ICandidate[]) {
	const componentSelector = '.' + className;
	const currentWidth = parseInt(d3.select(componentSelector).style('width'), 10);
	const procData = processData(data, totalDelegates);
	const margin = {top: 0, right: 20, bottom: 0, left: 20};

	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates])
		.range([0, currentWidth - margin.left - margin.right]);

	procData.forEach((d: any) => {
		d3.select(componentSelector + ` .rect-${d.id}`)
			.attr('width', xScale(d.delegates))
			.attr('x', xScale(d.cumulative));
	});
}

/**
 * Re-create bar chart with up-to-date store data
 */
function resetBar() {
	createBar(Array.from(candidates.value));
}

/**
 * Create bar chart using D3
 * 
 * @param data 
 */
function createBar(data: ICandidate[]) {
	console.log('createBar', data)
	const componentSelector = '.' + className;
	const currentWidth = parseInt(d3.select(componentSelector).style('width'), 10);
	const height = 100;
	const margin = {top: 0, right: 20, bottom: 0, left: 20};
	const procData = processData(data, totalDelegates);

	// Remove SVG if exists
	d3.select(componentSelector + ' svg').remove();

	// Initialize new SVG area with height
	const svg = d3.select(componentSelector)
		.append("svg")
		.attr("height", height)
		.attr('width', currentWidth - margin.right);
	
	// Set up horizontal scale
	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates])
		.range([0, currentWidth - margin.left - margin.right]);

	// Attach data
	const join = d3.select('svg').selectAll('g')
		.data(procData)
		.join('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Add rects
	join.append('rect')
		.attr('class', (d: any) => `rect-${d.id}`)
		.attr('x', (d: any) => xScale(d.cumulative))
		.attr('height', height)
		.attr('width', (d: any) => xScale(d.delegates))
		.style('fill', (d: any) => d.color);
}

onMounted(() => {
	createBar(Array.from(candidates.value));
	window.addEventListener('resize', resetBar);
});
</script>

<template>
	<div :class="className"></div>
</template>
  
<style>
.c-delegateBar {
	display: flex;
	margin-bottom: 20px;
}

/* rect {
	animation: create-bar 1s ease-in-out forwards;
} */

rect {
	transition: all 200ms ease-out;
}

/* @keyframes create-bar {
	from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
} */


</style>