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
	d3.legend?
	http://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7
( ) refine design/colors
( ) add header to matrix
( ) post on transmote
*/


import d3_array from 'd3-array';
import d3_axis from 'd3-axis';
// import d3_brush from 'd3-brush';		// not ported to v4 yet: https://github.com/d3/d3/issues/2461
import d3All from 'd3'
import d3_collection from 'd3-collection';
import d3_ease from 'd3-ease';
import d3_format from 'd3-format';
import d3_request from 'd3-request';
import d3_scale from 'd3-scale';
import d3_selection from 'd3-selection';
import d3_transition from 'd3-transition';
const d3 = {
	...d3_array,
	...d3_axis,
	// ...d3_brush,
	brush: d3All.svg.brush,
	...d3_collection,
	...d3_ease,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection,
	...d3_transition
};

const topNamesScatterplot = () => {

	let margin,
		width,
		height,
		graphContainer,
		xScale,
		yScale,
		rScale,
		brush;

	let rankCutoff = 100,
		domains,
		stats;
	
	const init = () => {

		d3.csv('./data/all.csv', onDataLoaded);


	};

	const onDataLoaded = (error, data) => {

		stats = d3.nest()
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

		/*
		// filter down to only the names that have appeared
		// in the top { rankCutoff } at least { topOccurrencesMin } times
		stats = stats.filter(d => d.value.numTopOccurrences >= topOccurrencesMin && d.value.numTopOccurrences <= topOccurrencesMin + topOccurrencesSpread);
		*/

		domains = {
			year: d3.extent(data, d => +d.year),
			fraction: [0, d3.max(data, d => +d.fraction)],
			// occurrence: [0, d3.max(stats, d => d.value.occurrences.length)],
			// rank: [0, d3.max(stats, d => d.value.medianRank)],
			topOccurrence: [0, 100]
		};

		/*
		// now that we have domains.year, calculate age of each name
		stats.forEach(d => {
			d.value.age = domains.year[1] - d.value.firstYear
		});
		domains.age = d3.extent(stats, d => d.value.age);
		*/

		render();

	};

	const render = () => {

		d3.select('#app').classed('top-names-scatterplot', true);

		initSidebar();
		initGraph();

	}

	const initSidebar = () => {

		let sidebar = d3.select('.top-names-scatterplot .sidebar'),
			sidebarEl = sidebar.node(),
			copy = sidebar.append('div').attr('class', 'copy'),
			sliderContainer = sidebar.append('div').attr('class', 'slider');

		let sliderWidth = 40,
			sliderMargin = {
				top: 20,
				right: 40,
				bottom: 20,
				left: 40
			},
			width = sidebarEl.offsetWidth - sliderMargin.left - sliderMargin.right,
			height = sidebarEl.offsetHeight - copy.node().offsetHeight - sliderMargin.top - sliderMargin.bottom,
			sliderSvg = sliderContainer.append('svg')
				.attr('width', width + sliderMargin.left + sliderMargin.right)
				.attr('height', height + sliderMargin.top + sliderMargin.bottom)
			.append('g')
				.attr('transform', `translate(${ 0.5 * (width - sliderWidth) + sliderMargin.left },${ sliderMargin.top })`);

		let sliderScale = d3.scaleLinear()
			.clamp(true)
			.domain(domains.topOccurrence)
			.range([height, 0]);

		let sliderBackground = sliderSvg.append('rect')
			.attr('class', 'slider-background')
			.attr('width', sliderWidth)
			.attr('height', height);

		let sliderAxis = d3.axisLeft()
			.scale(sliderScale)
			.tickFormat(d3.format('d'))
		sliderSvg.append('g')
			.classed('y axis', true)
			.call(sliderAxis);

		let topOccurrencesMin = 90,
			topOccurrencesSpread = 10,
			stepSize = 5;
		brush = d3.brush()
			.y(sliderScale)
			.extent([topOccurrencesMin, topOccurrencesMin + topOccurrencesSpread])
			.on('brushend', (type, ex0, ex1) => {

				if (!d3All.event.sourceEvent) { return; }

				renderNames();

				/*
				// snap brush extent
				let currentExtent = brush.extent(),
					targetExtent = currentExtent.map(v => Math.round(v / stepSize) * stepSize);

				// if empty after rounding, use floor/ceil instead
				if (targetExtent[0] >= targetExtent[1]) {
					targetExtent[0] = Math.floor(currentExtent[0] / stepSize) * stepSize;
					targetExtent[1] = Math.floor(currentExtent[1] / stepSize) * stepSize;
				}

				d3.select(this).transition()
					.call(brush.extent(targetExtent))
					.call(brush.event);
				*/
			});
		
		sliderSvg.append('g')
			.call(brush)
			.call(brush.event)
		.selectAll('rect')
			.attr('width', sliderWidth);

	};

	const initGraph = () => {

		let sidebarEl = d3.select('.top-names-scatterplot .sidebar').node();

		margin = {
			top: 20,
			right: 40,
			bottom: 60,
			left: 60
		};
		width = window.innerWidth - sidebarEl.offsetWidth - margin.left - margin.right;
		height = window.innerHeight - margin.top - margin.bottom;

		xScale = d3.scaleLinear()
			.clamp(true)
			.domain(domains.year)
			.range([0, width]);

		yScale = d3.scaleLinear()
			// .domain(domains.rank)
			.domain([0, 1000])
			.range([0, height]);

		rScale = d3.scalePow()
			.exponent(0.5)
			.domain(domains.fraction)
			.range([1, 20]);

		graphContainer = d3.select('.top-names-scatterplot .graph').append('svg')
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

				renderNames();
				initGraphInteraction(xScale, yScale, rScale);

			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);

	};

	const renderNames = () => {

		highlightName(null);

		// filter down to only the names that have appeared
		// in the top { rankCutoff } a number of times specified by brush extent
		let occurrenceExtent = brush.extent(),
			filteredNames = stats.filter(d => 
				d.value.numTopOccurrences >= occurrenceExtent[0] &&
				d.value.numTopOccurrences <= occurrenceExtent[1]
			);

		console.log(occurrenceExtent);
		console.log(filteredNames.map(n => n.key));

		let namePlots = graphContainer.selectAll('.name')
			.data(filteredNames, d => d.key);

		// update
		// namePlots.transition()
		// 	.attr();

		// enter
		let namePlotsEnter = namePlots.enter().append('g')
			.attr('class', d => 'name ' + d.value.sex);
		namePlotsEnter.append('circle')
			.attr('cx', d => xScale(d.value.maxYear))
			.attr('cy', d => yScale(d.value.medianRank))
		.transition()
			.duration(500)
			.ease(t => d3.easeBackOut(t, 3.0))	// custom overshoot isn't working...why?
			.attr('r', d => rScale(d.value.maxFraction));
		namePlotsEnter.append('text')
			.attr('x', d => xScale(d.value.maxYear))
			.attr('y', d => yScale(d.value.medianRank) + 5)
			.text(d => d.value.name);

		// exit
		namePlots.exit().remove();

	};

	const initGraphInteraction = (xScale, yScale, rScale) => {

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
