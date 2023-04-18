<template>
	<div :class="className"></div>
	<div class="c-delegateBarTooltip"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as d3 from 'd3';
import { storeToRefs } from 'pinia';

import { useCandidatesStore, ICandidate } from '../stores/candidates';
import { useStore } from '../stores/store';

interface ICandidateBarChart extends ICandidate {
	cumulative: number,
	percent: number
}

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const { candidates } = storeToRefs(candidatesStore);
const { totalDelegates } = storeToRefs(mainStore);

const className: string = 'c-delegateBar';
const barHeight: number = 80;

candidatesStore.$subscribe(() => { // TODO: Consider watch() instead https://pinia.vuejs.org/core-concepts/state.html#subscribing-to-the-state
	updateBar(Array.from(candidates.value));
});

/**
 * Sorts candidate data in descending order by delegate amount
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
function processData(data: ICandidate[], totalDelegates: number): ICandidateBarChart[] {
	const percent = (delegates: number) => Number((delegates / totalDelegates * 100).toFixed(2));
	let cumulativeDelegates: number = 0; // Keeps track of how many delegates assigned as we iterate over data

	sortData(data);

	// Filter and format data for D3
	const procData: ICandidateBarChart[] = data.map((d: ICandidate) => {
		const delegates = Math.max(d.delegates, 0);
		cumulativeDelegates += delegates;
	
		return {
			id: d.id,
			delegates: delegates,
			color: d.color,
			cumulative: cumulativeDelegates - delegates,
			name: d.name,
			percent: percent(delegates)
		}
	});

	// Empty/unallocated space
	const leftoverDelegates: number = totalDelegates - cumulativeDelegates;
	procData.push({
		id: procData.length,
		delegates: leftoverDelegates, 
		color: '#d3d3d3', 
		cumulative: cumulativeDelegates,
		name: 'Unallocated',
		percent: percent(leftoverDelegates)
	});

	return procData;
};

/**
 * Update bar chart rect sizes based on new data
 * 
 * @param data
 */
function updateBar(data: ICandidate[]) {
	const componentSelector: string = '.' + className;
	const currentWidth: number = parseInt(d3.select(componentSelector).style('width'), 10);
	const procData: ICandidateBarChart[] = processData(data, totalDelegates.value);
	const tooltip = d3.select('.c-delegateBarTooltip .tooltip');

	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates.value])
		.range([0, currentWidth]);

	const mousemove = function(event: any, d: ICandidateBarChart) {
		tooltip.html(`<div>${d.name} <div>${d.percent}% (${d.delegates} delegates)</div></div>`)
			.style("left", `${d3.pointer(event)[0] + 20}px`)
			.style("top", `${d3.pointer(event)[1] - 60}px`);
	}

	// Adjust rect sizes and update tooltip based on data
	procData.forEach((d: ICandidateBarChart) => {
		d3.select(componentSelector + ` .rect-${d.id}`)
			.attr('width', xScale(d.delegates))
			.attr('x', xScale(d.cumulative))
			.on('mousemove', (event) => mousemove(event, d));
	});
}

/**
 * Create bar chart using D3
 * 
 * @param data 
 */
function createBar(data: ICandidate[]) {
	const componentSelector: string = '.' + className;
	const currentWidth: number = parseInt(d3.select(componentSelector).style('width'), 10);
	const procData: ICandidateBarChart[] = processData(data, totalDelegates.value);

	// Remove SVG and tooltip elements
	d3.select(componentSelector + ' svg').remove();
	d3.select('.c-delegateBarTooltip div').remove();

	// Initialize new SVG area with height
	d3.select(componentSelector)
		.append('svg')
		.attr('height', barHeight);
	
	// Set up horizontal scale
	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates.value])
		.range([0, currentWidth]);

	// Attach/join an array of data
	const join = d3.select(componentSelector + ' svg').selectAll('g')
		.data(procData)
		.join('g');

	// Create tooltip
	const tooltip = d3.select('.c-delegateBarTooltip')
		.append('div')
		.style("opacity", 0)
    .attr("class", "tooltip")

	const mouseover = function(event: any, d: ICandidateBarChart) {
		// Update tooltip
		tooltip.style("opacity", 1)
			.style('background-color', d.color)
	
		// Update rect
    d3.select(event.target)
      .style("opacity", 0.8)
	}

	const mousemove = function(event: any, d: ICandidateBarChart) {
		tooltip.html(`<div>${d.name} <div>${d.percent}% (${d.delegates} delegates)</div></div>`)
			.style("left", `${d3.pointer(event)[0] + 20}px`)
			.style("top", `${d3.pointer(event)[1] - 60}px`);
	}

	const mouseleave = function(event: any, d: ICandidateBarChart) {
		// Update tooltip
		tooltip.style("opacity", 0);

		// Update rect
    d3.select(event.target)
      .style("opacity", 1);
	}

	// Add rects
	join.append('rect')
		.attr('class', (d: ICandidateBarChart) => `rect-${d.id}`)
		.attr('x', (d: ICandidateBarChart) => xScale(d.cumulative))
		.attr('height', barHeight)
		.attr('width', (d: ICandidateBarChart) => xScale(d.delegates))
		.style('fill', (d: ICandidateBarChart) => d.color)
		.on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
		.on('mousemove', mousemove);
}

/**
 * Re-create bar chart with up-to-date store data
 */
function resetBar() {
	createBar(Array.from(candidates.value));
}

onMounted(() => {
	createBar(Array.from(candidates.value));
	window.addEventListener('resize', resetBar);
});
</script>
  
<style>
.c-delegateBar {
	display: flex;
	width: 100%;
	margin-bottom: var(--standard-spacing);
}

.c-delegateBar svg {
	width: 100%;
}

.c-delegateBar rect {
	transition: all 200ms ease-out;
}

.c-delegateBarTooltip {
	position: absolute;
}

.c-delegateBarTooltip .tooltip {
	z-index: 999;
	position: absolute;
	width: 200px;
	margin: 5px;
	border-radius: 25px;
	padding: 10px;
	color: #000000;
	font-family: var(--standard-font-family);
	font-size: 16px;
	font-weight: bold;
	text-align: center;
}

/* @media (max-width: 1024px) {
	.c-delegateBarTooltip {
		display: none;
	}
} */
</style>