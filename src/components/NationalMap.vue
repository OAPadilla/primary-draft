<template>
	<div :class="className"></div>
</template>

<script setup lang="ts">
	import { computed, onMounted, watchEffect, Ref } from 'vue';
	import * as d3 from 'd3';
	import * as topojson  from 'topojson-client';

	import { useCandidatesStore } from '../stores/candidates';
	import { useStore } from '../stores/store';
	import { useUsStatesStore, IState } from '../stores/usStates';

	const candidatesStore = useCandidatesStore();
	const mainStore = useStore();
	const usStatesStore = useUsStatesStore();

	const className: string = 'c-nationalMap';
	const usMapJSON = 'https://d3js.org/us-10m.v1.json';
	const stateNamesTSV = 'https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv';
	const hiddenInitialsTextIds = [7, 8, 9, 21, 22, 34, 43]; // Remove CT, DC, DE, MA, MD, NJ, RI
	const initialsTextOffsets: Record<number, Record<string, number>> = {
		0: { y: -2 }, 				// AK
		5: { y: 20 },					// CA
		10: { x: 20, y: 15 },	// FL
		13: { x: 17, y: 20 },	// HI
		15: { y: 20 },				// ID
		20: { x: -10 },				// LA
		24: { x: 15, y: 30 },	// MI
		33: { y: 11 },				// NH
		51: { x: -1, y: 1 }		// VT
	};

	const selectedCandidateId: Ref<number> = computed(() => {
		return mainStore.getSelectedCandidateId.value;
	});

	const getCandidateName: Ref<string> = computed(() => {
		return candidatesStore.getCandidateName(selectedCandidateId.value);
	});

	watchEffect(() => {
		// Watch US states store for changes in color based on results
		for (const usState of usStatesStore.usStates) {
			d3.selectAll(`.state-${usState.id}`)
				.style('fill', usState.color);
    }
	});

	/**
	 * Get the store state id from provided state initials. 
	 * TSV uses different state IDs, instead we can utilize state initials to help create unison data.
	 * 
	 * @param stateInitial
	 */
	function getStateIdFromInitials(stateInitial: string): number|undefined {
		const usState = usStatesStore.getStateByInitial(stateInitial);
		return usState?.id;
	};

	/**
	 * Get and format TSV data tied to topojson geo data to workable state data inline with store
	 * 
	 * @param geoStateTSV 
	 */
	function getGeoStateData(geoStateTSV: any): Record<string, any> {
		const geoStates: Record<string, any> = {};

		geoStateTSV.forEach((state: Record<string, string>) => {
			let key: string = state?.id;

			if (key) {
				if (state?.id?.length === 1) {
					key = '0' + state.id;
				}

				if (state?.code) {
					geoStates[key] = {
						id: getStateIdFromInitials(state.code),
						initials: state.code
					}
				}
			}
		});

		return geoStates;
	};

	/**
	 * Updated selected state identifier in store
	 * 
	 * @param stateId 
	 */
	function setSelectedState(stateId: number) {
		mainStore.setSelectedStateId(stateId);
	};

	/**
	 * Allocate percentage of vote to candidate in state results.
	 * Default allocation is a majority of the vote (50.1%). If amount not available we deduct from lowest ranked candidate.
	 * 
	 * @param stateId 
	 * @param percent
	 */
	function updateStateResult(stateId: number, percent: number = 50.1) {
		usStatesStore.updateCandidatePercentage(selectedCandidateId.value, stateId, percent);
	};

	/**
	 * Handle state/territory onclick events
	 * 
	 * @param stateId 
	 */
	function onStateClick(stateId: number) {
		setSelectedState(stateId);

		// To visually identify state clicked on
		// d3.selectAll(`.c-nationalMap .states path`).classed("selected", false); // Main states
		// d3.selectAll(`.c-nationalMap .states rect`).classed("selected", false); // Avatar states
		d3.selectAll(`.state-name-${stateId}`).classed("selected", false); // Main and avatar states
		d3.selectAll(`.c-nationalMap .states-names text`).classed("selected", false); // State initials text
		d3.selectAll(`.state-${stateId}`).classed("selected", true);
		d3.selectAll(`.state-name-${stateId}`).classed("selected", true);

		if (getCandidateName.value) {
			updateStateResult(stateId);
		}
	}

	/**
	 * Create a square svg element representing a state/territory for simpler/alternative interactivity
	 * @param svg 
	 * @param x x-axis position
	 * @param y y-axis position
	 * @param stateId 
	 */
	function createStateAvatar(svg: any, x: number, y: number, stateId: number) {
		const width = 40;
		const height = 40;

		// Container element
		const g = svg.append('g')
			.attr('class', `states states-names`)

		// Rect element
		g.append('rect')
			.attr('class', `state-${stateId}`)
			.attr('x', x)
			.attr('y', y)
			.attr('width', width)
			.attr('height', height)
			.on('click', () => {
				onStateClick(stateId);
			});
		
		// Text element
		g.append('text')
			.attr('class', () => `state-name-${stateId}`)
			.attr('x', x + width/2)
			.attr('y', y + height/1.5)
			.text(() => {
				return usStatesStore.getStateById(stateId).initials;
			})
	};

	/**
	 * Create map using D3 and TopoJSON
	 */
 	function createMap(jsonData: any, geoStateNames: any) {
		const componentSelector: string = '.' + className;
		
		// Remove SVG elements for resets
		d3.select(componentSelector + ' svg').remove();

		const svg = d3.select(componentSelector)
			.append('svg')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', `0 0 950 600`);

		const path: any = d3.geoPath();

		const stateGeoFeatures: any = topojson.feature(jsonData, jsonData?.objects?.states).features;
		
		// Setup state ids to match state data from TSV
		const geoStates: Record<string, any> = getGeoStateData(geoStateNames);

		// Build paths for US states and add on click event
		svg.append('g')
			.attr('class', 'states')
			.selectAll('path')
			.data(stateGeoFeatures)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('class', (d: any) => `state-${geoStates[d.id].id}`)
			.on("click", (event, d: any) => {
				const stateId: number = geoStates[d.id].id;
				if (stateId !== null) {
					onStateClick(stateId);
				}
			});

		// Set state initials text
		svg.append('g')
			.attr('class', 'states-names')
			.selectAll('text')
			.data(stateGeoFeatures)
			.enter()
			.append('svg:text')
			.attr('class', (d: any) => `state-name-${geoStates[d.id].id}`)
			.text((d: any) => {
				if (!hiddenInitialsTextIds.includes(geoStates[d.id].id)) {
					return geoStates[d.id].initials;
				}
			})
			.attr('x', (d: any) => {
				// Call function with mapped value for x
				if (initialsTextOffsets?.[geoStates[d.id].id]?.x) {
					return path.centroid(d)[0] + initialsTextOffsets[geoStates[d.id].id].x;
				}
				return path.centroid(d)[0];
			})
			.attr('y', (d: any) => {
				// Call function with mapped value for y
				if (initialsTextOffsets?.[geoStates[d.id].id]?.y) {
					return path.centroid(d)[1] + initialsTextOffsets[geoStates[d.id].id].y;
				}
				return path.centroid(d)[1] + 5;
			});

		// Borders
		svg.append('path')
			.attr('class', 'state-borders')
			.attr('d', path(topojson.mesh(jsonData, jsonData?.objects?.states, (a, b) => {
				return  a !== b;
			})));

		// Territories
		createStateAvatar(svg, 525, 550, geoStates['60'].id); // American Samoa
		createStateAvatar(svg, 575, 550, geoStates['66'].id); // Guam
		createStateAvatar(svg, 625, 550, geoStates['69'].id); // Northern Marianas
		createStateAvatar(svg, 675, 550, geoStates['78'].id); // Virgin Islands

		// Small states
		createStateAvatar(svg, 875, 225, geoStates['25'].id); // MA
		createStateAvatar(svg, 875, 275, geoStates['44'].id); // RI
		createStateAvatar(svg, 875, 325, geoStates['09'].id); // CT
		createStateAvatar(svg, 875, 375, geoStates['34'].id); // NJ
		createStateAvatar(svg, 875, 425, geoStates['10'].id); // DE
		createStateAvatar(svg, 875, 475, geoStates['24'].id); // MD
		createStateAvatar(svg, 875, 525, geoStates['11'].id); // DC

		// Set color based on current results
		for (const usState of usStatesStore.usStates) {
			d3.selectAll(`.state-${usState.id}`)
				.style('fill', usState.color);
    }
	};

	onMounted(async () => {
		const jsonData = await d3.json(usMapJSON);
		const geoStateNames: any = await d3.tsv(stateNamesTSV);

		createMap(jsonData, geoStateNames);

		window.addEventListener('resize', () => {
			createMap(jsonData, geoStateNames);
		}); // TODO: debounce and destroy
	});
</script>

<style>
.c-nationalMap {
	display: flex;
	width: 100%;
	margin-bottom: 20px;
}

.c-nationalMap svg {
	fill: #bfbfbf;
}

.c-nationalMap path:hover,
.c-nationalMap rect:hover {
	fill-opacity: 0.7;
}

.c-nationalMap .state-borders {
	fill: none;
	stroke: #fff;
	stroke-width: 0.5px;
	stroke-linejoin: round;
	stroke-linecap: round;
	pointer-events: none;
}

.states-names text {
	fill: #FFFFFF;
	text-anchor: middle;
	pointer-events: none;
}

.states-names text.selected  {
	fill: #000000;
	font-weight: bold;
}
</style>