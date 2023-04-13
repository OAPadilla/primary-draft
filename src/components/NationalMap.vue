<template>
	<div :class="className"></div>
</template>

<script setup lang="ts">
	import { computed, onMounted, Ref } from 'vue';
	import * as d3 from 'd3';
	import * as topojson  from 'topojson-client';

	import { useStore } from '../stores/store';
	import { useUsStatesStore, IState } from '../stores/usStates';

	const mainStore = useStore();
	const usStatesStore = useUsStatesStore();

	const className: string = 'c-nationalMap';
	const usMapJSON = 'https://d3js.org/us-10m.v1.json';
	const stateNamesTSV = 'https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv';

	const selectedStateId: Ref<number> = computed(() => {
		return mainStore.getSelectedStateId.value;
	});

	function updateSelectedState(stateId: number) {
		mainStore.setSelectedStateId(stateId);
	};

	/**
	 * Get the store state id from provided state initials. 
	 * TSV uses different state IDs, instead we can utilize state initials to help create unison data.
	 * 
	 * @param stateInitial
	 */
	function getStateIdFromInitials(stateInitial: string): number {
		const usState = usStatesStore.getStateByInitial(stateInitial);
		return usState?.id;
	}

	/**
	 * Get and format TSV data tied to topojson geo data to workable state data inline with store
	 * 
	 * @param geoStateTSV 
	 */
	function getGeoStateData(geoStateTSV: any): Record<string, number> {
		const geoStates: Record<string, number> = {};

		geoStateTSV.forEach((state: Record<string, string>) => {
			let key: string = state?.id;

			if (key) {
				if (state?.id?.length === 1) {
					key = '0' + state.id;
				}

				if (state?.code) {
					geoStates[key] = getStateIdFromInitials(state.code);
				}
			}
		});

		return geoStates;
	}

	/**
	 * Create rect for easier/alternative access to clickable state/territories
	 * 
	 * @param svg 
	 * @param x x-axis position
	 * @param y y-axis position
	 * @param stateId 
	 */
	function createStateRect(svg: any, x: number, y: number, stateId: number) {
		svg.append('rect')
			.attr('x', x)
			.attr('y', y)
			.attr('width', 40)
			.attr('height', 40)
			.on('click', () => {
				updateSelectedState(stateId);
			});
	}

	/**
	 * Create map using D3 and TopoJSON
	 */
 	function createMap(jsonData: any, geoStateNames: any) {
		const componentSelector: string = '.' + className;
		const currentWidth: number = parseInt(d3.select(componentSelector).style('width'), 10);
		
		// Remove SVG elements for resets
		d3.select(componentSelector + ' svg').remove();

		const svg = d3.select('.c-nationalMap')
			.append('svg')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', `0 0 950 600`);

		const path: any = d3.geoPath();

		const stateGeoFeatures: any = topojson.feature(jsonData, jsonData?.objects?.states).features;
		
		// Setup state ids to match state data from TSV
		const geoStates: Record<string, number> = getGeoStateData(geoStateNames);

		svg.append('g')
			.attr('class', 'states')
			.selectAll('path')
			.data(stateGeoFeatures)
			.enter()
			.append('path')
			.attr('d', path)
			.on("click", (event, d: any) => {
				const stateId: number = geoStates[d.id];
				if (stateId !== null) {
					updateSelectedState(stateId);
				}
			});

		svg.append('path')
			.attr('class', 'state-borders')
			.attr('d', path(topojson.mesh(jsonData, jsonData?.objects?.states, (a, b) => {
				return  a !== b;
			})));

		// Territories
		createStateRect(svg, 525, 550, geoStates['60']); // American Samoa
		createStateRect(svg, 575, 550, geoStates['66']); // Guam
		createStateRect(svg, 625, 550, geoStates['69']); // Northern Marianas
		createStateRect(svg, 675, 550, geoStates['78']); // Virgin Islands

		// Small states
		createStateRect(svg, 875, 225, geoStates['25']); // MA
		createStateRect(svg, 875, 275, geoStates['44']); // RI
		createStateRect(svg, 875, 325, geoStates['09']); // CT
		createStateRect(svg, 875, 375, geoStates['34']); // NJ
		createStateRect(svg, 875, 425, geoStates['10']); // DE
		createStateRect(svg, 875, 475, geoStates['24']); // MD
		createStateRect(svg, 875, 525, geoStates['11']); // DC
	}

	onMounted(async () => {
		const jsonData: any = await d3.json(usMapJSON);
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
</style>