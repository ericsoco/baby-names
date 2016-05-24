/*
TODO:
( ) add UI to slide down scale of popularity.
	this is filtering on topOccurrencesMin;
	the more topOccurrences, the more popular.

	other possible filters:
	( ) topOccurrencesSpread
	( ) rankCutoff
	shouldn't make all values filterable; keep it simple. max 2.
	maybe make a slider for all three and then figure out which combo
	gives most interesting results?

	a simple d3-brush could allow adjusting topOccurences + spread.

( ) refine radius scale (what's best metric here?)
( ) add legend (color, radius)
( ) refine design/colors
( ) add header to matrix
( ) post on transmote
*/


import d3_array from 'd3-array';
import d3_axis from 'd3-axis';
import d3_brush from 'd3-brush';
import d3_collection from 'd3-collection';
import d3_format from 'd3-format';
import d3_request from 'd3-request';
import d3_scale from 'd3-scale';
import d3_selection from 'd3-selection';
const d3 = {
	...d3_array,
	...d3_axis,
	...d3_brush,
	...d3_collection,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection
};

const topNamesScatterplot = () => {

	let margin,
		width,
		height,
		xScale,
		yScale,
		rScale;

	let rankCutoff = 100,
		topOccurrencesMin = 20,
		topOccurrencesSpread = 10;
	
	const init = () => {

		d3.csv('./data/all.csv', onDataLoaded);


	};

	const onDataLoaded = (error, data) => {

		let stats = d3.nest()
			.key(d => d.name)
				.sortKeys(d3.ascending)
			.rollup(values => {
				let maxFraction = d3.max(values, d => d.fraction);

				return {
					name: values[0].name,
					sex: values[0].sex,
					firstYear: d3.min(values, d => +d.year),
					lastYear: d3.max(values, d => +d.year),
					maxYear: values.find(d => d.fraction === maxFraction).year,
					maxFraction: maxFraction,
					medianRank: d3.median(values, d => +d.rank),
					occurrences: d3.nest()
						.key(d => d.year)
							.sortKeys(d3.ascending)
						.entries(values),
					numTopOccurrences: values.reduce((total, d) => {
						return total + (+d.rank < rankCutoff ? 1 : 0);
					}, 0)
				};
			})
			.entries(data);

		// filter down to only the names that have appeared
		// in the top { rankCutoff } at least { topOccurrencesMin } times
		stats = stats.filter(d => d.value.numTopOccurrences >= topOccurrencesMin && d.value.numTopOccurrences <= topOccurrencesMin + topOccurrencesSpread);

		let domains = {
				year: d3.extent(data, d => +d.year),
				fraction: [0, d3.max(data, d => +d.fraction)],
				occurrence: [0, d3.max(stats, d => d.value.occurrences.length)],
				rank: [0, d3.max(stats, d => d.value.medianRank)]
			},
			numYears = domains.year[1] - domains.year[0] + 1;

		// now that we have domains.year, calculate age of each name
		stats.forEach(d => {
			d.value.age = domains.year[1] - d.value.firstYear
		});
		domains.age = d3.extent(stats, d => d.value.age);

		render(domains, stats);

	};

	const render = (domains, data) => {

		d3.select('#app').classed('top-names-scatterplot', true);

		initSidebar(domains, data);
		initGraph(domains, data);

	}

	const initSidebar = (domains, data) => {


		/*
		let sidebarMargin = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20
		};
		width = window.innerWidth - margin.left - margin.right;
		height = window.innerHeight - margin.top - margin.bottom;

		// TODO: put these, along with fractionScale,
		// into a place they can be accessed and updated from all local functions.
		let xScale = d3.scaleLinear()
			.clamp(true)
			.domain(domains.year)
			.range([0, width]);

		let yScale = d3.scaleLinear()
			.domain(domains.rank)
			.range([0, height]);

		let rScale = d3.scalePow()
			.exponent(0.5)
			.domain(domains.fraction)
			.range([1, 20]);

		let graphContainer = d3.select('.top-names-scatterplot .sidebar').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.classed('top-names-scatterplot', true)
		.append('g')
			.attr('transform', `translate(${ margin.left },${ margin.top })`);

		*/

	};

	const initGraph = (domains, data) => {

		console.log(data);

		let sidebar = d3.select('.top-names-scatterplot .sidebar');

		margin = {
			top: 20,
			right: 40,
			bottom: 60,
			left: 60
		};
		width = window.innerWidth - sidebar.node().offsetWidth - margin.left - margin.right;
		height = window.innerHeight - margin.top - margin.bottom;

		// TODO: put these, along with fractionScale,
		// into a place they can be accessed and updated from all local functions.
		let xScale = d3.scaleLinear()
			.clamp(true)
			.domain(domains.year)
			.range([0, width]);

		let yScale = d3.scaleLinear()
			.domain(domains.rank)
			.range([0, height]);

		let rScale = d3.scalePow()
			.exponent(0.5)
			.domain(domains.fraction)
			.range([1, 20]);

		let graphContainer = d3.select('.top-names-scatterplot .graph').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', `translate(${ margin.left },${ margin.top })`);

		let xAxis = d3.axisBottom()
			.scale(xScale)
			.tickFormat(d3.format('d'))
		let xAxisEl = graphContainer.append('g')
			.classed('x axis', true)
			.attr('transform', `translate(0,${ height + 20 })`)
			.call(xAxis)
		xAxisEl.append('text')
			.classed('label', true)
			.attr('x', width)
			.attr('y', -10)
			.style('text-anchor', 'end')
			.text('Year');

		let yearTick = xAxisEl.append('g')
			.attr('class', 'year-tick');
		yearTick.append('line')
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y1', -10)
			.attr('y2', 0);
		yearTick.append('text')
			.attr('x', 0)
			.attr('y', -20);

		let yAxis = d3.axisLeft()
			.scale(yScale)
			.tickFormat(d3.format('d'))
		graphContainer.append('g')
			.classed('y axis', true)
			.attr('transform', `translate(-20,0)`)
			.call(yAxis)
		.append('text')
			.classed('label', true)
			.attr('transform', 'rotate(-90)')
			.attr('x', 0)
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('Average rank');

		// wait to build and render circles until after axes have rendered.
		// wait two frames to ensure stack has cleared and DOM has updated+rendered.
		let frameCount = 0;

		let onRAF = () => {
			frameCount++;

			if (frameCount === 2) {

				let namePlots = graphContainer.append('g').selectAll('.name')
					.data(data);

				let namePlotsEnter = namePlots.enter().append('g')
					.attr('class', d => 'name ' + d.value.sex);

				namePlotsEnter.append('circle')
					.attr('cx', d => xScale(d.value.maxYear))
					.attr('cy', d => yScale(d.value.medianRank))
					.attr('r', d => rScale(d.value.maxFraction));

				namePlotsEnter.append('text')
					.attr('x', d => xScale(d.value.maxYear))
					.attr('y', d => yScale(d.value.medianRank) + 5)
					.text(d => d.value.name);
					
				initInteraction(xScale, yScale, rScale);

			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);

	};

	const initInteraction = (xScale, yScale, rScale) => {

		let graphEl = document.querySelector('.top-names-scatterplot .graph');

		graphEl.addEventListener('click', event => {

			let datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				// console.log(datum);
				highlightName(datum.key, xScale, yScale, rScale);
			} else {
				highlightName(null);
			}

		});

		graphEl.addEventListener('mousemove', event => {

			let year = Math.round(xScale.invert(event.pageX - graphEl.offsetLeft - margin.left)),
				yearTick = d3.select('.year-tick');
			yearTick.select('line')
				.attr('x1', xScale(year))
				.attr('x2', xScale(year));
			yearTick.select('text')
				.attr('x', xScale(year))
				.text(year);

		});

	};

	const highlightName = (name, xScale, yScale, rScale) => {

		let names = d3.select('.top-names-scatterplot .graph svg').selectAll('.name');

		if (!name) {

			names.classed('highlighted', false);
			d3.selectAll('.timespan').remove();

		} else {

			let nameElement = names.filter(d => d.value.name === name),
				nameDatum = nameElement.datum();

			// TODO: use update pattern to remove all this stuff on
			//		non-highlighted elements
			// TODO: transition by spreading out and pulling back in timespan lines/circles

			nameElement.classed('highlighted', true);
			let timespan = nameElement.append('g', ':first-child')
				.attr('class', 'timespan');

			timespan.append('line')
				.attr('x1', d => xScale(d.value.firstYear))
				.attr('y1', d => yScale(d.value.medianRank))
				.attr('x2', d => xScale(d.value.lastYear))
				.attr('y2', d => yScale(d.value.medianRank));

			/*
			// end ticks
			timespan.append('line')
				.attr('x1', d => xScale(d.value.firstYear))
				.attr('y1', d => yScale(d.value.medianRank) - 5)
				.attr('x2', d => xScale(d.value.firstYear))
				.attr('y2', d => yScale(d.value.medianRank) + 5);
			timespan.append('line')
				.attr('x1', d => xScale(d.value.lastYear))
				.attr('y1', d => yScale(d.value.medianRank) - 5)
				.attr('x2', d => xScale(d.value.lastYear))
				.attr('y2', d => yScale(d.value.medianRank) + 5);
			*/

			// console.log("occurrences:", nameDatum.value.occurrences.length, "top occurrences:", nameDatum.value.numTopOccurrences);
			let circles = timespan.selectAll('circle')
				.data(nameDatum.value.occurrences)
			.enter().append('circle')
				// .each(d => { console.log(d); })
				.attr('class', 'occurrence')
				.classed('top-rank', d => +d.values[0].rank < rankCutoff)
				.attr('cx', d => xScale(d.values[0].year))
				.attr('cy', d => yScale(nameDatum.value.medianRank))
				.attr('r', d => rScale(d.values[0].fraction));

		}


	};

	return {
		init
	};

}

export default topNamesScatterplot;
