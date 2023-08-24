<template>
	<div class="c-delegateBar">
		<div class="c-delegateBar_icons">
			<FlagIcon class="c-delegateBar_flag" :style="{ fill: flagColor }"/>
			<ResetIcon 
				class="c-delegateBar_resetBtn"
				:class="{ '-rotate': resetActivated }"
				@click="showResetModal = true"
			/>
		</div>
		<div :class="barClass"></div>
		<div class="c-delegateBar_tooltip"></div>

		<ConfirmModal
			:acceptText="$t('reset')"
			:message="$t('confirmModalMessageReset')"
			:show="showResetModal"
			@accept="onResetConfirmed"
			@cancel="showResetModal = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, Ref } from 'vue';
import * as d3 from 'd3';
import { storeToRefs } from 'pinia';

import FlagIcon from '../assets/icons/flag.svg?component';
import ResetIcon from '../assets/icons/reset.svg?component';
import ConfirmModal from '../components/ConfirmModal.vue';

import { useCandidatesStore, ICandidate } from '../stores/candidates';
import { useStore } from '../stores/store';
import { useUsStatesStore } from '../stores/usStates';

interface ICandidateBarChart extends ICandidate {
	cumulative: number,
	percent: number
}

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const usStatesStore = useUsStatesStore();

const { selectedPartyId } = storeToRefs(mainStore);

const barClass: string = 'c-delegateBar_bar';
const barHeight: number = 60;
const defaultFlagColor: string = 'none';
const flagColor: Ref<string> = ref(defaultFlagColor);
const resetActivated: Ref<boolean> = ref(false);
const showResetModal = ref(false);
const tooltipWidth: number = 200;

watch(candidatesStore, () => {
	updateBar(candidatesStore.getCandidates);

	// Update flag color based on if majority vote reached by candidate
	const winningCandidate: Ref<ICandidate> | null = candidatesStore.getWinnerCandidate;
	flagColor.value = winningCandidate ? winningCandidate.value.color : defaultFlagColor;
});

watch(selectedPartyId, () => {
	resetBar();
});

/**
 * Sorts candidate data in descending order by delegate amount
 * 
 * @param d 
 */
function sortData(d: ICandidate[]): ICandidate[] {
	return [...d].sort((a: ICandidate, b: ICandidate) => {
		return b.delegates - a.delegates;
	});
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

	// Filter and format data for D3
	const procData: ICandidateBarChart[] = sortData(data).map((d: ICandidate) => {
		const delegates = Math.max(d.delegates, 0);
		cumulativeDelegates += delegates;
	
		return {
			id: d.id,
			delegates: delegates,
			color: d.color,
			cumulative: cumulativeDelegates - delegates,
			name: d.name,
			percent: percent(delegates)
		};
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
	tooltip.html(`<div>${d.name}</div><div>${d.percent}%</div><div>${d.delegates} delegates</div>`)
		.style("left", `${left}px`)
		.style("top", `${d3.pointer(event)[1] - 20}px`);
}

/**
 * Reset actions once user confirms
 */
function onResetConfirmed(): void {
	// Hide modal
	showResetModal.value = false;
	usStatesStore.resetAllResults();

	// Animate reset icon
	resetActivated.value = true;
	setTimeout(() => {
		resetActivated.value = false;
	}, 500);
}

/**
 * Update bar chart rect sizes based on new data
 * 
 * @param data
 */
function updateBar(data: ICandidate[]): void {
	const componentSelector: string = '.' + barClass;
	const procData: ICandidateBarChart[] = processData(data, mainStore.getPartyTotalDelegates);
	const tooltip = d3.select('.c-delegateBar_tooltip .tooltip');

	const xScale = d3.scaleLinear<string|number, number>()
		.domain([0, mainStore.getPartyTotalDelegates])
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
	const procData: ICandidateBarChart[] = processData(data, mainStore.getPartyTotalDelegates);

	// Remove SVG and tooltip elements
	d3.select(componentSelector + ' svg').remove();
	d3.select('.c-delegateBar_tooltip div').remove();

	// Initialize new SVG area with height
	const svg = d3.select(componentSelector)
		.append('svg')
		.attr('height', barHeight);

	// Set up horizontal scale
	const xScale = d3.scaleLinear<string|number, number>()
		.domain([0, mainStore.getPartyTotalDelegates])
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
	createBar(candidatesStore.getCandidates);
}

onMounted(() => {
	createBar(candidatesStore.getCandidates);
	window.addEventListener('resize', resetBar);
});

onUnmounted(() => {
	window.removeEventListener('resize', resetBar);
});
</script>
  
<style lang="scss">
@import '@/styles/main.scss';

.c-delegateBar {
	margin-bottom: $standard-spacing;

	&_bar {
		display: flex;

		svg {
			width: 100%;
		}

		rect {
			transition: all 200ms ease-out;
		}
	}

	&_icons {
		display: flex;
	}

	&_majorityMarker {
		stroke: $color-black;
		stroke-width: 1.5;
		stroke-dasharray: 3;
	}

	&_flag {
		display: flex;
		margin: auto;
		margin-bottom: 0;
		padding-left: 43px;
		stroke: $color-black;
		width: -webkit-fill-available; // For Safari, centers flag
	}

	&_resetBtn {
		width: 21px;
		height: 20px;
		padding: 5px;

		&:hover {
			opacity: 0.7;
			cursor: pointer;
		}

		&.-rotate {
			transition: transform 0.5s ease;
			transform: rotate(-360deg);
		}
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
			color: $color-black;
			font-family: $standard-font-family;
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			box-shadow: $standard-box-shadow;
		}
	}
}
</style>