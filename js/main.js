/*
TODO:
scatterplot versions

*/

import 'babel-polyfill';

import d3_array from 'd3-array';
import d3_collection from 'd3-collection';
import d3_request from 'd3-request';
import d3_scale from 'd3-scale';
import d3_selection from 'd3-selection';
const d3 = {
	...d3_array,
	...d3_collection,
	...d3_request,
	...d3_scale,
	...d3_selection
};

let startTime;

const init = () => {

	console.log('loading data...');
	startTime = performance.now();
	
	d3.csv('./data/all.csv', onDataLoaded);
	// d3.csv('./data/1880-1882.csv', onDataLoaded);

};

const onDataLoaded = (error, data) => {

	let loadTime = performance.now();
	console.log(`data loaded in ${loadTime - startTime}ms.`);
	console.log('processing data...');

	// slice to 1930 for testing
	data = data.slice(0, 100000);

	let yearExtents = d3.extent(data, d => +d.year),
		fractionExtents = [0, d3.max(data, d => +d.fraction)],
		numYears = yearExtents[1] - yearExtents[0] + 1;

	let yearsByName = d3.nest()
		.key(d => d.name)
			.sortKeys(d3.ascending)
		.key(d => d.year)
			.sortKeys(d3.ascending)
		.rollup(d => ({
			sex: d[0].sex,
			fraction: +d[0].fraction
		}))
		.entries(data);

	// backfill absent years and
	// add metadata (sex) to each top-level entry
	yearsByName.forEach(d => {
		
		d.sex = d.values[0].value.sex;

		if (d.values.length < numYears) {
			for (let i=yearExtents[0]; i<=yearExtents[1]; i++) {
				if (!d.values.find(v => +v.key === i)) {
					d.values.push({
						key: i.toString(),
						value: {
							fraction: 0
						}
					});
				}
			}

			// resort after backfilling absent years
			d.values.sort((a, b) => a.key - b.key);
		}
	});

	let processedTime = performance.now();
	console.log(`data processed in ${processedTime - loadTime}ms.`);

	initGraph({
		year: yearExtents,
		fraction: fractionExtents
	}, yearsByName);

};

const initGraph = (domains, data) => {

	// console.log(data);

	const outerMargin = 20,
		rowHeight = 16,
		width = document.querySelector('body').innerWidth - 2 * outerMargin,
		height = rowHeight * data.length,
		margin = {
			top: 10,
			right: 10,
			bottom: 70,
			left: 10
		};

	let rScale = d3.scaleLinear()
		.domain(domains.fraction)
		.range([0, 2*rowHeight]);

	console.log('building DOM...');
	let startTime = performance.now();

	let tableContainer = d3.select('#app').append('table'),
		header = tableContainer.append('thead'),
		table = tableContainer.append('tbody');

	let rows = table.selectAll('.row')
		.data(data);

	let rowsEnter = rows.enter()
		.append('tr')
		.attr('class', d => d.sex + ' row');
	rowsEnter.append('th')
		.text(d => d.key);

	let rowsTime = performance.now();
	console.log(`rows built in ${rowsTime - startTime}ms.`);

	let cells = rowsEnter.selectAll('.punch')
		.data(d => d.values);

	let cellsEnter = cells.enter()
		.append('td')
		.classed('punch', true);

	cellsEnter.each(function (d, i) {
		let size = Math.ceil(rScale(d.value.fraction));
		if (size) {
			d3.select(this)
				.append('div')
				.style('width', size + 'px')
				.style('height', size + 'px');
		}
	});

	let cellsTime = performance.now();
	console.log(`cells built in ${cellsTime - rowsTime}ms.`);

	let frameCount = 0;
	let onRAF = () => {
		if (frameCount++) {
			let renderedTime = performance.now();
			console.log(`rendered in ${renderedTime - cellsTime}ms.`);
			console.log(`total time: ${renderedTime - startTime}ms.`);
		} else {
			window.requestAnimationFrame(onRAF);
		}
	};
	window.requestAnimationFrame(onRAF);

};

init();
