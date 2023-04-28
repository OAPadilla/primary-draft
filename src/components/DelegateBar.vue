<template>
	<div class="c-delegateBar">
		<FlagIcon class="c-delegateBar_flag" :style="{ fill: flagColor }"/>
		<div :class="barClass"></div>
		<div class="c-delegateBar_tooltip"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, Ref } from 'vue';
import * as d3 from 'd3';
import { storeToRefs } from 'pinia';

import FlagIcon from '../assets/icons/flag.svg?component';

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

const barClass: string = 'c-delegateBar_bar';
const barHeight: number = 60;
const defaultFlagColor: string = 'none';
const flagColor: Ref<string> = ref(defaultFlagColor)
const tooltipWidth: number = 200;

candidatesStore.$subscribe(() => { // TODO: Consider watch() instead https://pinia.vuejs.org/core-concepts/state.html#subscribing-to-the-state
	updateBar(Array.from(candidates.value));

	// Update flag color based on if majority vote reached by candidate
	const winningCandidate: Ref<ICandidate> | null = candidatesStore.getWinnerCandidate;
	flagColor.value = winningCandidate ? winningCandidate.value.color : defaultFlagColor;
});

/**
 * Sorts candidate data in descending order by delegate amount
 * 
 * @param d 
 */
function sortData(d: ICandidate[]): ICandidate[] {
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
	const percent = (delegates: number): number => Number((delegates / totalDelegates * 100).toFixed(2));
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
 * Handle on mouse move event for delegate bar
 * 
 * @param event 
 * @param d 
 * @param tooltip 
 */
function onMousemove(event: any, d: ICandidateBarChart, tooltip: any): void {
	const currentWidth: number = parseInt(d3.select('.' + barClass).style('width'), 10);

	const switchPoint = currentWidth - tooltipWidth - 20;
	const left = Math.min(d3.pointer(event)[0] - 20, switchPoint);
	tooltip.html(`<div>${d.name} <div>${d.percent}% (${d.delegates} delegates)</div></div>`)
		.style("left", `${left}px`)
		.style("top", `${d3.pointer(event)[1] - 20}px`);
}

/**
 * Update bar chart rect sizes based on new data
 * 
 * @param data
 */
function updateBar(data: ICandidate[]): void {
	const componentSelector: string = '.' + barClass;
	const procData: ICandidateBarChart[] = processData(data, totalDelegates.value);
	const tooltip = d3.select('.c-delegateBar_tooltip .tooltip');

	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates.value])
		.range([0, '100%']);

	// Adjust rect sizes and update tooltip based on data
	procData.forEach((d: ICandidateBarChart) => {
		d3.select(componentSelector + ` .rect-${d.id}`)
			.attr('width', xScale(d.delegates))
			.attr('x', xScale(d.cumulative))
			.on('mousemove', (event) => onMousemove(event, d, tooltip));
	});
}

/**
 * Create bar chart using D3
 * 
 * @param data 
 */
function createBar(data: ICandidate[]): void {
	const componentSelector: string = '.' + barClass;
	const procData: ICandidateBarChart[] = processData(data, totalDelegates.value);

	// Remove SVG and tooltip elements
	d3.select(componentSelector + ' svg').remove();
	d3.select('.c-delegateBar_tooltip div').remove();

	// Initialize new SVG area with height
	const svg = d3.select(componentSelector)
		.append('svg')
		.attr('height', barHeight);

	// Set up horizontal scale
	const xScale = d3.scaleLinear()
		.domain([0, totalDelegates.value])
		.range([0, '100%']);

	// Attach/join an array of data
	const join = d3.select(componentSelector + ' svg').selectAll('g')
		.data(procData)
		.join('g');

	// Create tooltip
	const tooltip = d3.select('.c-delegateBar_tooltip')
		.append('div')
		.style('visibility', 'hidden')
    .attr("class", "tooltip");

	const mouseover = (event: any, d: ICandidateBarChart): void => {
		// Update tooltip
		tooltip.style('visibility', 'visible')
			.style('background-color', d.color);
	
		// Update rect
    d3.select(event.target)
      .style("opacity", 0.8);
	}

	const mouseleave = (event: any): void => {
		// Update tooltip
		tooltip.style('visibility', 'hidden');

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
		.on('mousemove', (event: any, d: any) => onMousemove(event, d, tooltip));

	// Create majority marker
	svg.append('line')
		.attr('class', `c-delegateBar_majorityMarker`)
		.attr('x1', '50%')
		.attr('x2', '50%')
		.attr('y1', 0)
		.attr('y2', barHeight);
}

/**
 * Re-create bar chart with up-to-date store data
 */
function resetBar(): void {
	createBar(Array.from(candidates.value));
}

onMounted(() => {
	createBar(Array.from(candidates.value));
	window.addEventListener('resize', resetBar);
});

onUnmounted(() => {
	window.removeEventListener('resize', resetBar);
})
</script>
  
<style lang="scss">
.c-delegateBar {
	margin-bottom: var(--standard-spacing);

	&_bar {
		display: flex;

		svg {
			width: 100%;
		}

		rect {
			transition: all 200ms ease-out;
		}
	}

	&_majorityMarker {
		stroke: var(--color-black);
		stroke-width: 1.5;
		stroke-dasharray: 3;
	}

	&_flag {
		display: flex;
		margin: auto;
		padding-left: 12px;
		stroke: var(--color-black);
	}

	&_tooltip {
		position: absolute;

		.tooltip {
			z-index: 999;
			position: absolute;
			width: 200px;
			margin: 5px;
			border-radius: 25px;
			padding: 10px;
			color: var(--color-black);
			font-family: var(--standard-font-family);
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			box-shadow: var(--standard-box-shadow);
		}
	}
}
</style>