import d3_array from 'd3-array';
import d3_axis from 'd3-axis';
import d3_format from 'd3-format';
import d3_request from 'd3-request';
import d3_scale from 'd3-scale';
import d3_selection from 'd3-selection';
import d3_transition from 'd3-transition';
const d3 = {
	...d3_array,
	...d3_axis,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection,
	...d3_transition
};

const scatterplot = () => {

	const init = () => {

		d3.csv('./data/all.csv', onDataLoaded);

	};

	const onDataLoaded = (error, data) => {

		// slice to subset for testing
		// data = data.slice(0, 100000);

		// filter down to only top names per year
		data = data.filter(d => +d.rank <= 100);

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

		// console.log(data);

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

				let circles = graphContainer.append('g').selectAll('circle')
					.data(data);

				let circlesEnter = circles.enter()
					.append('circle')
					.attr('class', d => d.sex)
					.attr('cx', d => xScale(+d.year))
					.attr('cy', d => yScale(d.nameNumeric))
					// .attr('cy', d => yScale(d.name[0].toUpperCase().charCodeAt() - 65))
					.attr('r', d => rScale(+d.fraction));

				initInteraction(xScale, yScale);

			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);

	};

	const initInteraction = (xScale, yScale) => {

		document.querySelector('#app').addEventListener('mousemove', event => {
			let datum = d3.select(event.target).datum();
			if (datum && datum.name) {
				highlightName(datum.name, xScale, yScale);
			}
		});

	};

	const highlightName = (name, xScale, yScale) => {

		let circles = d3.selectAll('#app circle'),
			selectedCircles = circles.filter(d => d.name === name);
		circles.classed('highlighted', d => d.name === name);

		selectedCircles.raise();
		
		// draw label below circle at year with highest prevalence of selected name
		let maxFraction = d3.max(selectedCircles.data(), d => d.fraction),
			centerCircle = selectedCircles.filter(d => d.fraction === maxFraction),
			x = centerCircle.attr('cx'),
			y = centerCircle.attr('cy'),
			datum = centerCircle.datum();

		// label
		let graphContainer = d3.select('#app svg > g'),
			label = graphContainer.selectAll('.selection-label')
				.data([datum]);

		let label1 = `${ datum.name }`,
			label2 = `${ datum.year } — ${ (datum.fraction * 100).toFixed(2) }%`;

		label/*.transition()*/
			.attr('x', x)
			.attr('y', +y + 32);

		let labelEnter = label.enter().append('text')
			.classed('selection-label', true)
			.attr('x', x)
			.attr('y', +y + 32)
			.style('text-anchor', 'middle');
		labelEnter.append('tspan');
		labelEnter.append('tspan');

		graphContainer.selectAll('.selection-label').selectAll('tspan')
			.each(function (d, i) {
				d3.select(this)
					.style('text-anchor', 'middle')
					.text(i ? label2 : label1)
				/*.transition()*/
					.attr('x', x)
					.attr('dy', i ? '1em' : 0);
			});

		// vertical year marker
		let line = graphContainer.selectAll('.selection-line')
			.data([datum])

		line.attr('transform', d => `translate(${ xScale(d.year) }, 0)`);

		line.enter().append('line', ':first-child')
			.classed('selection-line', true)
			.attr('y1', d => yScale(0))
			.attr('y2', d => yScale(26))
			.attr('transform', d => `translate(${ xScale(d.year) }, 0)`);

	}

	return {
		init
	};

}

export default scatterplot;
