<template>
	<div class="c-nationalMap">
		<div class="c-nationalMap_tooltip"></div>
		<div :class="mapClass"></div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, onUnmounted, watchEffect, Ref } from 'vue';
	import * as d3 from 'd3';
	import * as topojson from 'topojson-client';

	import { useCandidatesStore } from '../stores/candidates';
	import { useStore } from '../stores/store';
	import { useUsStatesStore, IState } from '../stores/usStates';

	interface IGeoState { 
		id: number,
		initials: string
	}

	const candidatesStore = useCandidatesStore();
	const mainStore = useStore();
	const usStatesStore = useUsStatesStore();

	const mapClass: string = 'c-nationalMap_map';
	const usMapJSON: string = 'https://d3js.org/us-10m.v1.json';
	const tooltipWidth: number = 125;
	const hiddenInitialsTextIds: number[] = [7, 8, 9, 21, 22, 34, 43]; // Remove CT, DC, DE, MA, MD, NJ, RI
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
	let geoStateNames: any = null;
	let jsonData: any = null;

	const selectedCandidateId: Ref<number> = computed(() => {
		return mainStore.getSelectedCandidateId;
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
	function getStateIdFromInitials(stateInitial: string): number|null {
		const usState: IState|null = usStatesStore.getStateByInitial(stateInitial);

		if (usState?.id == null) {
			return null;
		}

		return usState?.id;
	};

	/**
	 * Get and format TSV data tied to topojson geo data to workable state data inline with store
	 * 
	 * @param geoStateTSV 
	 */
	function getGeoStateData(geoStateTSV: any): Record<string, IGeoState> {
		const geoStates: Record<string, IGeoState> = {};

		geoStateTSV.forEach((state: Record<string, string>) => {
			let key: string = state?.id;

			if (key) {
				if (state?.id?.length === 1) {
					key = '0' + state.id;
				}

				if (state?.code) {
					const stateId = getStateIdFromInitials(state.code);
					if (stateId !== null) {
						geoStates[key] = {
							id: stateId,
							initials: state.code
						}
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
	function setSelectedState(stateId: number): void {
		mainStore.setSelectedStateId(stateId);
	};

	/**
	 * Allocate percentage of vote to candidate in state results.
	 * Default allocation is a majority of the vote (50.1%). If amount not available we deduct from lowest ranked candidate.
	 * 
	 * @param stateId 
	 * @param percent
	 */
	function updateStateResult(stateId: number, percent: number = 50.1): void {
		usStatesStore.updateCandidatePercentage(selectedCandidateId.value, stateId, percent);
	};

	/**
	 * Handle state/territory onclick events
	 * 
	 * @param stateId 
	 */
	function onStateClick(stateId: number): void {
		setSelectedState(stateId);

		// To visually identify state clicked on
		d3.selectAll(`.${mapClass} .states path`).classed("selected", false); // Main states
		d3.selectAll(`.${mapClass} .states rect`).classed("selected", false); // Avatar states
		d3.selectAll(`.${mapClass} .states-names text`).classed("selected", false); // State initials text
		d3.selectAll(`.state-${stateId}`).classed("selected", true);
		d3.selectAll(`.state-name-${stateId}`).classed("selected", true);

		if (getCandidateName.value) {
			updateStateResult(stateId);
		}
	};

	/**
	 * Handle on mouse move event for US state, such as for the tooltip position and content
	 * 
	 * @param event 
	 * @param stateId 
	 * @param tooltip 
	 */
	function onStateMousemove(event: any, stateId: number, tooltip: any): void {
		const map = d3.select('.' + mapClass);
		const currentWidth: number = parseInt(map.style('width'), 10);
		const stateData: IState = usStatesStore.getStateById(stateId);
		const switchPoint: number = currentWidth - tooltipWidth;
		const border: string = selectedCandidateId.value !== -1 ? `3px solid ${candidatesStore.getCandidateColor(selectedCandidateId.value)}` : 'unset';
	
		const [x, y]: number[] = d3.pointer(event, map.node());
		const left: number = Math.min(x - 20, switchPoint);

		tooltip.html(`
			<div class="c-nationalMap_tooltip_name">${stateData.name}</div>
			<div class="c-nationalMap_tooltip_del">${stateData.totalDelegates} del.</div>
			<div class="c-nationalMap_tooltip_alloc">${stateData.allocation}</div>
		`)
		.style('left', `${left}px`)
		.style('top', `${y + 40}px`)
		.style('border', border);
	};

	/**
	 * Create a square svg element representing a state/territory for simpler/alternative interactivity
	 * 
	 * @param svg 
	 * @param x x-axis position
	 * @param y y-axis position
	 * @param stateId 
	 */
	function createStateAvatar(svg: any, x: number, y: number, stateId: number): void {
		const width: number = 40;
		const height: number = 40;

		// Container element
		const g = svg.append('g')
			.attr('class', `states states-names`);

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
			.text((): string => {
				return usStatesStore.getStateById(stateId).initials;
			});

		// Find tooltip
		const tooltip = d3.select('.c-nationalMap_tooltip .tooltip');

		// Set mouse events
		g.on('mouseover', () => tooltip.style('visibility', 'visible'))
			.on('mouseleave', () => tooltip.style('visibility', 'hidden'))
			.on('mousemove', (event: any) => onStateMousemove(event, stateId, tooltip));
	};

	/**
	 * Create map using D3 and TopoJSON
	 * 
	 * @param jsonData 
	 * @param geoStateNames
	 */
 	function createMap(jsonData: any, geoStateNames: any): void {
		const componentSelector: string = '.' + mapClass;
		
		// Remove SVG elements for resets
		d3.select(componentSelector + ' svg').remove();
		d3.select('.c-nationalMap_tooltip .tooltip').remove();

		const svg = d3.select(componentSelector)
			.append('svg')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', `0 0 950 600`);

		const path: any = d3.geoPath();

		// @ts-ignore: Property 'features' does not exist on type 'Feature<Point, GeoJsonProperties>'
		const stateGeoFeatures: any = topojson.feature(jsonData, jsonData?.objects?.states).features;
		
		// Strip required TSV state data with our state id
		const geoStates: Record<string, IGeoState> = getGeoStateData(geoStateNames);

		// Create tooltip
		const tooltip = d3.select('.c-nationalMap_tooltip')
			.append('div')
			.attr("class", "tooltip");

		// Build paths for US states and add on click event
		const g = svg.append('g')
			.attr('class', 'states')
			.selectAll('path')
			.data(stateGeoFeatures)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('class', (d: any) => `state-${geoStates[d.id]?.id}`)
			.on("click", (event: any, d: any) => {
				const stateId: number = geoStates[d.id]?.id;
				if (stateId !== null) {
					onStateClick(stateId);
				}
			});
			
		// Set mouse events
		g.on('mouseover', () => tooltip.style('visibility', 'visible'))
			.on('mouseleave', () => tooltip.style('visibility', 'hidden'))
			.on('mousemove', (event: any, d: any) => onStateMousemove(event, geoStates[d.id]?.id, tooltip));

		// State initials 
		svg.append('g')
			.attr('class', 'states-names')
			.selectAll('text')
			.data(stateGeoFeatures)
			.enter()
			.append('svg:text')
			.attr('class', (d: any) => `state-name-${geoStates[d.id]?.id}`)
			.text((d: any) => {
				if (!hiddenInitialsTextIds.includes(geoStates[d.id]?.id)) {
					return geoStates[d.id]?.initials;
				}
				return null;
			})
			.attr('x', (d: any) => {
				// Call function with mapped value for x
				if (initialsTextOffsets?.[geoStates[d.id]?.id]?.x) {
					return path.centroid(d)[0] + initialsTextOffsets[geoStates[d.id].id].x;
				}
				return path.centroid(d)[0];
			})
			.attr('y', (d: any) => {
				// Call function with mapped value for y
				if (initialsTextOffsets?.[geoStates[d.id]?.id]?.y) {
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
		jsonData = await d3.json(usMapJSON);
		// Original source: https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv
		geoStateNames = await d3.tsv('/data/us-state-names.tsv');

		createMap(jsonData, geoStateNames);

		window.addEventListener('resize', () => {
			createMap(jsonData, geoStateNames);
		});
	});

	onUnmounted(() => {
		window.removeEventListener('resize', () => {
			createMap(jsonData, geoStateNames);
		});
	})
</script>

<style lang="scss">
@import '@/styles/main.scss';

.c-nationalMap {
	&_map {
		display: flex;
		width: 100%;
		margin-bottom: $standard-spacing;

		@media (min-width: 1030px) {
			min-height: 620px;
			min-width: 940px;
		}

		svg {
			fill: $color-light-grey;
		}

		path:hover,
		rect:hover {
			fill-opacity: 0.7;
		}

		.state-borders {
			fill: none;
			stroke: $color-white;
			stroke-width: 0.5px;
			stroke-linejoin: round;
			stroke-linecap: round;
			pointer-events: none;
		}

		.states-names {
			text {
				fill: $color-white;
				text-anchor: middle;
				pointer-events: none;

				&.selected  {
					fill: $color-black;
					font-weight: bold;
				}
			}
		}
	}

	&_tooltip {
		position: absolute;
		visibility: hidden;

		@media (max-width: 768px) {
			.tooltip  {
				display: none;
			}
		}

		.tooltip {
			z-index: 999;
			position: absolute;
			background-color: $base-background-color;
			width: 125px;
			margin: 5px;
			border-radius: 25px;
			padding: 8px;
			color: $color-black;
			font-family: $standard-font-family;
			font-size: 14px;
			text-align: center;
			text-transform: capitalize;
			box-shadow: $standard-box-shadow;
		}

		&_name {
			font-weight: bold;
		}

		&_del {
			text-transform: none;
		}
	}
}
</style>