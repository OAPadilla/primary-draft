<template>
	<div class="c-nationalMap"></div>
</template>

<script setup lang="ts">
	import { computed, onMounted, Ref } from 'vue';
	import * as d3 from 'd3';
	import * as topojson  from 'topojson-client';

	import { useStore } from '../stores/store';

	const mainStore = useStore();

	const usMapJSON = 'https://d3js.org/us-10m.v1.json';
	const stateNamesTSV = 'https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv';

	function createStateRect(svg: any, x: number, y: number) {
		svg.append('rect')
			.attr('x', x)
			.attr('y', y)
			.attr('width', 40)
			.attr('height', 40);
	}

 	async function createMap() {
		const currentWidth: number = parseInt(d3.select('.c-nationalMap').style('width'), 10);
		const height: number = 600;
		let stateName = '';

		const svg = d3.select('.c-nationalMap')
			.append('svg')
			.attr('height', height)
			.attr('width', currentWidth)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', `0 0 ${currentWidth} ${height}`);

		// console.log(currentWidth);

		const path: any = d3.geoPath();

		const jsonData: any = await d3.json(usMapJSON);
		const stateGeoFeatures: any = topojson.feature(jsonData, jsonData?.objects?.states).features;
		
		const names: Record<string, string> = {};
		const stateNames = await d3.tsv(stateNamesTSV);
		stateNames.forEach((state) => {
			let key: string = state?.id || '';
			if (key) {
				if (state?.id?.length === 1) {
					key = '0' + state.id;
				}

				if (state?.name) {
					names[key] = state.name;
				}
			}
		});

		// console.log(names) 697 x 408

		svg.append('g')
			.attr('class', 'states')
			// .attr('fill', '#bfbfbf')
			.selectAll('path')
			.data(stateGeoFeatures)
			.enter()
			.append('path')
			.attr('d', path)
			.on('mousedown', (event, d) => {
				stateName = names[d.id];
				console.log(d)
			})
			// .on("click", selectState);


		svg.append('path')
			.attr('class', 'state-borders')
			.attr('d', path(topojson.mesh(jsonData, jsonData?.objects?.states, (a, b) => {
				return  a !== b;
			})));

		// Territories
		createStateRect(svg, 525, 550); // American Samoa
		createStateRect(svg, 575, 550); // Guam
		createStateRect(svg, 625, 550); // Northern Marianas
		createStateRect(svg, 675, 550); // Virgin Islands

		// Small states
		createStateRect(svg, 875, 225); // MA
		createStateRect(svg, 875, 275); // RI
		createStateRect(svg, 875, 325); // CT
		createStateRect(svg, 875, 375); // NJ
		createStateRect(svg, 875, 425); // DE
		createStateRect(svg, 875, 475); // MD
		createStateRect(svg, 875, 525); // DC
	}

	const selectedStateId: Ref<number> = computed(() => {
		return mainStore.getSelectedStateId.value;
	});

	onMounted(() => {
		console.log(selectedStateId.value);
		createMap();
	});
</script>

<style>
.c-nationalMap {
	display: flex;
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