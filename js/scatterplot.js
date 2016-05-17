import d3_array from 'd3-array';
import d3_axis from 'd3-axis';
import d3_format from 'd3-format';
import d3_request from 'd3-request';
import d3_scale from 'd3-scale';
import d3_selection from 'd3-selection';
const d3 = {
	...d3_array,
	...d3_axis,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection
};

const scatterplot = () => {

	let startTime;

	const init = () => {

		startTime = performance.now();
		
		d3.csv('./data/all.csv', onDataLoaded);

	};

	const onDataLoaded = (error, data) => {

		// slice to subset for testing
		// data = data.slice(0, 100000);

		// filter down to only top names per year
		data = data.filter(d => +d.rank <= 500);

		// calculate float (0<>26) for each name for alpha sort
		data.forEach(d => {
			d.nameNumeric = d.name.split('').reduce((acc, c, i) => {
				acc += (c.toUpperCase().charCodeAt(0) - 65) / Math.pow(26, i)
				return acc;
			}, 0);
		});

		let yearExtents = d3.extent(data, d => +d.year),
			fractionExtents = [0, d3.max(data, d => +d.fraction)],
			numYears = yearExtents[1] - yearExtents[0] + 1;

		initGraph({
			year: yearExtents,
			fraction: fractionExtents
		}, data);

	};

	const initGraph = (domains, data) => {

		console.log(data);

		const margin = {
				top: 60,
				right: 20,
				bottom: 20,
				left: 60
			},
			width = window.innerWidth - margin.left - margin.right,
			height = window.innerHeight - margin.top - margin.bottom;

		let xScale = d3.scaleLinear()
			.domain(domains.year)
			.range([0, width]);

		let yScale = d3.scaleLinear()
			.domain([0, 26])
			.range([0, height]);

		let rScale = d3.scaleLinear()
			.domain(domains.fraction)
			.range([0, 16]);

		let graphContainer = d3.select('#app').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.classed('scatterplot', true)
		.append('g')
			.attr('transform', `translate(${ margin.left },${ margin.top })`);

		let xAxis = d3.axisTop()
			.scale(xScale)
			.tickFormat(d3.format('d'))
		graphContainer.append('g')
			.classed('x axis', true)
			.attr('transform', `translate(0,-20)`)
			.call(xAxis);
		/*
		.append('text')
			.classed('label', true)
			.attr('x', width)
			.attr('y', 18)
			.style('text-anchor', 'end')
			.text('Year');
		*/

		let yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(26)
			.tickFormat((d, i) => i < 26 ? String.fromCharCode(i + 65) : '');
		graphContainer.append('g')
			.classed('y axis', true)
			.attr('transform', `translate(-20,0)`)
			.call(yAxis);
		/*
		.append('text')
			.classed('label', true)
			.attr('transform', 'rotate(-90)')
			.attr('x', 0)
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('First letter');
		*/

		// wait to build and render circles until after axes have rendered.
		// wait two frames to ensure stack has cleared and DOM has updated+rendered.
		let frameCount = 0;

		let onRAF = () => {
			frameCount++;

			if (frameCount === 2) {

				let circles = graphContainer.selectAll('circle')
					.data(data);

				let circlesEnter = circles.enter()
					.append('circle')
					.attr('class', d => d.sex)
					.attr('cx', d => xScale(+d.year))
					.attr('cy', d => yScale(d.nameNumeric))
					// .attr('cy', d => yScale(d.name[0].toUpperCase().charCodeAt() - 65))
					.attr('r', d => rScale(+d.fraction));

			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);

	};

	return {
		init
	};

}

export default scatterplot;
