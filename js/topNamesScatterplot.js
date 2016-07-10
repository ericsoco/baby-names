/*
TODO:
( ) display tooltip immediately on name click
	tried to do this in highlightName, but commented out cuz it's buggy
( ) display name and overall (all-time) rank somewhere.
	in tooltip?
	this is most interesting along with displaying all names
	somewhere larger / more graphic might be nice
( ) change popularity slider to allow display of all names:
	instead of number of occurrences, choose a popularity metric/algorithm, and make slider just a popularity slider.
	algo is something like: add up total (inverse: #1 is worth most) rank in all years
	two pluses:
		1, don't have to explain slider as "occurrences in the top 100 names of each year", it's just popularity (can break it down in text elsewhere)
		2, can show all 7000+ names

( ) write copy
		circles appear at year in which name was at its most popular
		circle size represents total number of babies with that name in that year
		copy has to move above/below the fold, not enough room in sidebar.
( ) refine design/colors
( ) be sure sidebar is responsive enough
( ) refine styles
	(-) gooey-ify spread names?
		http://bl.ocks.org/nbremer/69808ec7ec07542ed7df
	( ) blend modes?
( ) animate brush to new position

( ) fix up other prototypes
	( ) to work with new index.html
	( ) apply styles via top-level class
		in same way as .top-names-scatterplot
	( ) add header to matrix

( ) link to GH repo
( ) link to scraper
( ) shrink down bundle.js (2.3MB!!)

( ) post on transmote
( ) tweet to kai, nadieh bremer; lea verou (awesomplete)

(X) refine toggle styling, remove commented-out cruft
(X) add legend (color, radius)
	d3.legend?
	http://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7
(X) color circle by sex per year, not sex per name (Lindsay)
(X) change radius to represent total number of births
	(need total number of babies per year)
(X) find name (typeahead?)
	(X) typeahead
	(X) select name
	(X) hit enter to enter typed-in selection
(X) BUG: subsequent clicks on highlighted name draw again, instead of being ignored or bringing to front
(X) BUG: vertical offset problem on .timespan -- not always correctly aligned with highlighted name
	(due to force layout probably!)
(X) hover / tooltip on timespan circles
(X) add UI to slide down scale of popularity.
	this is filtering on topOccurrencesMin;
	the more topOccurrences, the more popular.

	other possible filters:
	(X) topOccurrencesSpread
	(X) rankCutoff
	shouldn't make all values filterable; keep it simple. max 2.
	maybe make a slider for all three and then figure out which combo
	gives most interesting results?

	a simple d3-brush could allow adjusting topOccurences + spread.
*/


import d3_array from 'd3-array';
import d3_axis from 'd3-axis';
// import d3_brush from 'd3-brush';		// not ported to v4 yet: https://github.com/d3/d3/issues/2461
import d3All from 'd3'
import d3_collection from 'd3-collection';
import d3_ease from 'd3-ease';
import d3_force from 'd3-force';
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
	...d3_force,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection,
	...d3_transition
};

import awesomplete from 'awesomplete';

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
		allNames,
		topNames;
	
	const init = () => {

		let loaded = {
			names: null,
			counts: null
		};

		const fileLoaded = (error, data, key) => {

			if (error) throw error;

			loaded[key] = data;
			if (loaded.names && loaded.counts) {
				onDataLoaded(loaded.names, loaded.counts)
			}

		};

		// from: https://www.ssa.gov/cgi-bin/popularnames.cgi,
		// via https://github.com/ericsoco/baby-name-scraper
		d3.csv('./data/all.csv', (error, data) => fileLoaded(error, data, 'names'));

		// from: https://www.ssa.gov/oact/babynames/numberUSbirths.html
		d3.tsv('./data/birthCounts.tsv', (error, data) => fileLoaded(error, data, 'counts'));

	};

	const onDataLoaded = (names, counts) => {

		domains = {
			year: d3.extent(names, d => +d.year),
			fraction: [0, d3.max(names, d => +d.fraction)]
			// occurrence: [0, d3.max(allNames, d => d.value.occurrences.length)],
			// rank: [0, d3.max(allNames, d => d.value.medianRank)],
		};
		domains.topOccurrence = [1, Math.floor((domains.year[1] - domains.year[0]) / 10) * 10];

		// calculate amount of each name per year,
		// based on name-year fraction and total count per year
		names.forEach(n => n.count = Math.round(+n.fraction * parseFloat(counts[+n.year - domains.year[0]].total)));

		domains.count = d3.extent(names, d => d.count);

		// restructure name data into a more useful format
		allNames = d3.nest()
			.key(d => d.name)
				.sortKeys(d3.ascending)
			.rollup(values => {
				let maxFraction = d3.max(values, d => d.fraction),
					maxFractionIndex = d3.scan(values, (a, b) => b.fraction - a.fraction),
					countAtMaxFraction = values[maxFractionIndex].count;

				return {
					name: values[maxFractionIndex].name,
					sex: values[maxFractionIndex].sex,
					firstYear: d3.min(values, d => +d.year),
					lastYear: d3.max(values, d => +d.year),
					maxYear: values.find(d => d.fraction === maxFraction).year,
					maxFraction,
					countAtMaxFraction,
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
			.entries(names);

		// some names have more numTopOccurrences than there are years in the data,
		// due to data errors. clamp them to avoid problems.
		allNames.forEach(name => name.value.numTopOccurrences = Math.min(domains.topOccurrence[1], name.value.numTopOccurrences));

		// filter down to only the names that have appeared
		// in the top { rankCutoff } at least once
		topNames = allNames.filter(d => d.value.numTopOccurrences);

		/*
		// now that we have domains.year, calculate age of each name
		allNames.forEach(d => {
			d.value.age = domains.year[1] - d.value.firstYear
		});
		domains.age = d3.extent(allNames, d => d.value.age);
		*/

		render();

	};

	const render = () => {

		d3.select('#app').classed('top-names-scatterplot', true);

		initGraph();
		initSidebar();

	}

	const initSidebar = () => {

		const topOccurrencesMin = 55,
			topOccurrencesSpread = 10;

		let sidebar = d3.select('.top-names-scatterplot .sidebar'),
			sidebarEl = sidebar.node(),
			copy = sidebar.append('div').attr('class', 'copy'),
			nameLookupContainer = sidebar.append('div').attr('class', 'name-lookup'),
			sliderContainer = sidebar.append('div').attr('class', 'slider'),
			toggleContainer = sidebar.append('div').attr('class', 'toggles'),
			legendContainer = sidebar.append('div').attr('class', 'legend');


		// 
		// copy
		// 
		let desc = document.querySelector('#app-description');
		copy.html(desc.innerHTML);
		document.querySelector('body').removeChild(desc);


		//
		// name lookup
		//
		let nameLookupInput = nameLookupContainer.append('input')
			.attr('class', 'awesomplete')
			.attr('placeholder', 'Find a name')
			.node();
		
		let names = topNames.map(name => name.key),
			valuesByName = topNames.reduce((acc, name) => {
				acc[name.key] = {
					numTopOccurrences: name.value.numTopOccurrences,
					sex: name.value.sex,
				};
				return acc;
			}, {}),
			nameLookup = new Awesomplete(nameLookupInput,
			{
				list: names,
				// autoFirst: true,
				sort: (a, b) => valuesByName[b.value].numTopOccurrences - valuesByName[a.value].numTopOccurrences,
				item: (itemText, inputText) => {
					let li = Awesomplete.ITEM(itemText, inputText);
					li.classList.add(valuesByName[itemText].sex);
					return li;
				}
			}
		);

		const onNameLookupSelected = event => {

			let name = topNames.find(d => d.key.toLowerCase() === event.target.value.toLowerCase());
			if (!name) {
				nameLookupInput.classList.add('not-found');
				setTimeout(() => {
					nameLookupInput.classList.remove('not-found');
				}, 1);
				return;
			}

			let brushExtent = [
				Math.max(domains.topOccurrence[0], +name.value.numTopOccurrences - topOccurrencesSpread/2),
				Math.min(domains.topOccurrence[1], +name.value.numTopOccurrences + topOccurrencesSpread/2)
			];

			if (brush) {

				// ensure sex toggle is on for selected name
				let sexToggle = toggleContainer.select(`.${name.value.sex}.sex-toggle`).node();
				if (!sexToggle.classList.contains('on')) {
					sexToggle.click();
				}
				
				// move brush to area where name exists
				// TODO: why are brush transitions not working?
				sidebar.select('.brush').transition()
					.duration(1000)
					.call(brush.extent(brushExtent))
					.call(brush)
					.call(brush.event);

				// highlight name after a delay
				setTimeout(() => {
					highlightName(name.key);
				}, 500);

			}

		};

		window.addEventListener('awesomplete-selectcomplete', onNameLookupSelected);

		// handle enter keypress
		nameLookupInput.addEventListener('keypress', event => {
			if (event.keyCode === 13) {
				onNameLookupSelected({
					target: {
						value: nameLookupInput.value
					}
				});
			}
		});


		//
		// popularity slider
		//
		let sliderWidth = 40,
			sliderMargin = {
				top: 20,
				right: 40,
				bottom: 60,
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

		let sliderGrid = sliderSvg.append('g')
			.attr('class', 'slider-background-grid')
			.call(d3.axisLeft()
				.scale(sliderScale)
				.tickSize(-sliderWidth)
				.tickValues([1, 20, 40, 60, 80, 100, 115, 130])
				.tickFormat(d3.format('d'))
			);

		brush = d3.brush()
			.y(sliderScale)
			.extent([topOccurrencesMin, topOccurrencesMin + topOccurrencesSpread]);

		// apply handler after delay to avoid
		// responding to initial brush setup
		setTimeout(() => {
			brush.on('brushend', () => {
				renderNames();
			});
		}, 1);
		
		sliderSvg.append('g')
			.attr('class', 'brush')
			.call(brush)
			.call(brush.event)
		.selectAll('rect')
			.attr('width', sliderWidth);

		sliderContainer.append('div')
			.attr('class', 'label')
			// .text(`Occurrences in the top ${ rankCutoff } names of each year`);
			.text('Popularity');


		//
		// sex toggles
		//
		toggleContainer.append('div')
			.attr('class', 'f sex-toggle on')
			.attr('data-sex', 'f')
			.html('<span>female</span>');
		toggleContainer.append('div')
			.attr('class', 'm sex-toggle on')
			.attr('data-sex', 'm')
			.html('<span>male</span>');
		toggleContainer.selectAll('div')
			.on('click', function (event) {
				// disable a checkbox if it's the only one checked
				// (don't allow unchecking all boxes)
				if (!this.classList.contains('disabled')) {
					this.classList.toggle('on');
				}

				let selectedToggles = d3.selectAll('.top-names-scatterplot .sex-toggle.on');
				if (selectedToggles.size() === 1) {
					selectedToggles.classed('disabled', true)
				} else {
					d3.selectAll('.top-names-scatterplot .sex-toggle')
						.classed('disabled', false)
				}

				renderNames();
			});


		// 
		// legend
		// 
		let legendSizes = [2000, 20000, 75000, 200000].reverse(),
			biggestSize = rScale(legendSizes[0]),
			labelHeight = 25;

		let legendMargin = {
				left: 20,
				right: 20
			},
			legendWidth = sidebarEl.offsetWidth - legendMargin.left - legendMargin.right,
			legendStrokeWidth = 2,
			legendSvg = legendContainer.append('svg')
				.attr('width', legendWidth)
				.attr('height', 2*biggestSize + 2 * legendStrokeWidth + labelHeight)
			.append('g')
				.attr('transform', `translate(${ 0.5 * legendWidth },0)`);

		let legendSel = legendSvg.selectAll('g.legend-item')
			.data(legendSizes);
		let legendEnter = legendSel.enter()
			.append('g')
				.classed('legend-item', true)
				.attr('transform', `translate(0,${ legendStrokeWidth })`)
		legendEnter.append('circle')
			.attr('cx', 0)
			.attr('cy', d => rScale(d))
			.attr('r', d => rScale(d));
		legendEnter.append('text')
			.attr('x', 0)
			.attr('y', d => 2 * rScale(d) + 12)
			.text(d => (d / 1000) + 'k');

		legendContainer.append('div')
			.attr('class', 'label')
			.text('Babies per year');

	};

	const initGraph = () => {

		let sidebarEl = d3.select('.top-names-scatterplot .sidebar').node();

		margin = {
			top: 20,
			right: 40,
			bottom: 80,
			left: 95
		};
		width = window.innerWidth - sidebarEl.offsetWidth - margin.left - margin.right;
		height = window.innerHeight - margin.top - margin.bottom;

		xScale = d3.scaleLinear()
			.clamp(true)
			.domain(domains.year)
			.range([0, width]);

		yScale = d3.scaleLinear()
			// .domain(domains.rank)
			.domain([0, 800])
			.range([0, height]);

		rScale = d3.scalePow()
			.exponent(0.5)
			// .domain(domains.fraction)
			.domain(domains.count)
			.range([5, 80]);

		graphContainer = d3.select('.top-names-scatterplot .graph').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', `translate(${ margin.left },${ margin.top })`);

		// 'gooey' filter from http://bl.ocks.org/nbremer/69808ec7ec07542ed7df
		var defs = d3.select('.top-names-scatterplot .graph svg').append('defs');
		var filter = defs.append('filter').attr('id','gooey');
		filter.append('feGaussianBlur')
			.attr('in','SourceGraphic')
			.attr('stdDeviation','3')
			.attr('result','blur');
		filter.append('feColorMatrix')
			.attr('in','blur')
			.attr('mode','matrix')
			.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
			.attr('result','gooey');
		filter.append('feComposite')
			.attr('in','SourceGraphic')
			.attr('in2','gooey')
			.attr('operator','atop');

		let xAxis = d3.axisBottom()
			.scale(xScale)
			.tickFormat(d3.format('d'))
		let xAxisEl = graphContainer.append('g')
			.classed('x axis', true)
			.attr('transform', `translate(0,${ height + 40 })`)
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
			.attr('transform', `translate(-40,0)`)
			.call(yAxis)
		.append('text')
			.classed('label', true)
			.attr('transform', 'rotate(-90)')
			.attr('x', 0)
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('Median rank');

		// wait to build and render circles until after axes have rendered.
		// wait two frames to ensure stack has cleared and DOM has updated+rendered.
		let frameCount = 0;

		let onRAF = () => {
			frameCount++;

			if (frameCount === 2) {

				renderNames();
				initGraphInteraction(xScale, yScale, rScale, margin);

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
			filteredNames = topNames.filter(d => 
				d.value.numTopOccurrences >= occurrenceExtent[0] &&
				d.value.numTopOccurrences <= occurrenceExtent[1]
			);
		// console.log(occurrenceExtent);
		// console.log(filteredNames.map(n => n.key));

		// filter to only selected sexes
		let sexToggles = d3.selectAll('.top-names-scatterplot .sex-toggle').nodes()
			.reduce((acc, el) => {
				acc[el.dataset.sex] = el.classList.contains('on');
				return acc;
			}, {});
		filteredNames = filteredNames.filter(d => sexToggles[d.value.sex]);

		const enterDuration = 300,
			enterEase = t => d3.easeBackOut(t, 3.0),	// custom overshoot isn't working...why?
			exitDuration = 750,
			exitEase = d3.easeQuad;

		let simulation = d3.forceSimulation(filteredNames)
			.force('x', d3.forceX(d => xScale(d.value.maxYear)).strength(1))
			.force('y', d3.forceY(d => yScale(d.value.medianRank)).strength(1))
			// .force('collide', d3.forceCollide(d => Math.pow(rScale(d.value.maxFraction), 0.9)))
			.force('collide', d3.forceCollide(d => Math.pow(rScale(d.value.countAtMaxFraction), 0.9)))
			.stop();
		for (let i = 0; i < 120; ++i) simulation.tick();

		let namePlots = graphContainer.selectAll('.name:not(.timespan)')
			.data(filteredNames, d => d.key);

		// update
		// namePlots.transition()
		// 	.attr();

		// enter
		let namePlotsEnter = namePlots.enter().append('g')
			.attr('class', d => 'name ' + d.value.sex)
			.attr('transform', d => `translate(${ Math.max(0, Math.min(width, d.x)) },${ Math.max(0, Math.min(height, d.y)) })scale(0.01)rotate(0)`)
			.attr('opacity', 0.0);
		namePlotsEnter.transition()
			.duration(enterDuration)
			.ease(enterEase)
			.attr('transform', d => `translate(${ Math.max(0, Math.min(width, d.x)) },${ Math.max(0, Math.min(height, d.y)) })scale(1.0)rotate(0)`)
			.attr('opacity', 1.0);
		namePlotsEnter.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			// .attr('r', d => rScale(d.value.maxFraction));
			.attr('r', d => rScale(d.value.countAtMaxFraction));
		namePlotsEnter.append('text')
			.attr('x', 0)
			.attr('y', 5)
			.text(d => d.value.name);

		// exit
		namePlots.exit().transition()
			.duration(exitDuration)
			.ease(exitEase)
			.attr('transform', d => `translate(${ d.x },${ d.y })scale(0.01)rotate(0)`)
			.attr('opacity', 0.0)
			.remove();

	};

	const initGraphInteraction = (xScale, yScale, rScale, margin) => {

		let graphEl = document.querySelector('.top-names-scatterplot .graph'),
			highlightedTimespanCircle = null;

		graphEl.addEventListener('click', event => {

			let datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				// console.log(datum);
				highlightName(datum.key);
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

		graphEl.addEventListener('mouseover', event => {

			let datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				if (!event.target.classList.contains('occurrence')) {
					hoverName(datum.key);
				}
			} else {
				hoverName(null);
			}

		});
		
		graphEl.addEventListener('mousemove', event => {

			let x = event.pageX - graphEl.offsetLeft - margin.left,
				y = event.pageY - graphEl.offsetTop - margin.top;

			const maxDist = 60;
			let shortestDist = Number.MAX_VALUE,
				closestCircle = null,
				dx, dy, dist,
				allCircles = d3.selectAll('.timespan circle');
			
			allCircles.each(function (d) {
				dx = this.getAttribute('cx') - x;
				dy = this.getAttribute('cy') - y;
				dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < maxDist && dist < shortestDist) {
					shortestDist = dist;
					closestCircle = this;
				}
			});

			closestCircle = d3.select(closestCircle);
			hoverTimespanCircle(closestCircle, highlightedTimespanCircle);
			highlightedTimespanCircle = closestCircle;

		});

	};

	const hoverName = name => {

		let names = graphContainer.selectAll('.name:not(.timespan)')
			.classed('hover', false);

		if (name) {
			names.filter(d => d.key === name)
				.classed('hover', true)
				.raise();
		}

	};

	const hoverTimespanCircle = (circleSel, lastCircleSel) => {

		let tooltip = d3.select('.timespan-tooltip');
		if (!circleSel || !circleSel.size()) {
			if (tooltip.size()) {
				tooltip.transition()
					.delay(500)
					.duration(500)
					.style('opacity', 0.0)
					.remove();
			}

			if (lastCircleSel && lastCircleSel.node() !== circleSel.node()) {
				lastCircleSel.classed('highlighted-occurrence', false);
			}

			return;
		}

		let datum = circleSel.datum(),
			name = datum.values[0].name,
			year = datum.values[0].year,
			count = datum.values[0].count,
			rank = datum.values[0].rank,
			sex = datum.values[0].sex;

		circleSel.classed('highlighted-occurrence', true);
		circleSel.raise();

		if (lastCircleSel && lastCircleSel.node() !== circleSel.node()) {
			lastCircleSel.classed('highlighted-occurrence', false);
		}

		let graphContainer = d3.select('.top-names-scatterplot .graph'),
			tooltipWidth = 96;	// topNamesScatterplot.scss#.timespan-tooltip.min-width;
		tooltip = graphContainer.select('.timespan-tooltip');

		if (!tooltip.size()) {
			tooltip = graphContainer.append('div')
				.classed('timespan-tooltip', true)
			tooltip.append('h4');
			tooltip.append('h5');
		}

		let circleY = +circleSel.attr('cy'),
			tooltipTop = circleY > 0.5 * graphContainer.node().offsetHeight ?
				circleY - 80 :
				circleY + 50;

		tooltip.classed(sex, true)
			.classed(sex === 'm' ? 'f' : 'm', false)
			.style('left', `${ +circleSel.attr('cx') + margin.left - 0.5*tooltipWidth - 10 }px`)
			.style('top', `${ tooltipTop }px`)
			.style('opacity', null);
		tooltip.select('h4').text(`${ name }, ${ year }`);
		tooltip.select('h5').text(`${ count } (#${ rank })`);

	};

	const highlightName = name => {

		// TODO: DRY this out -- copied from renderNames()
		const enterDuration = 300,
			enterEase = t => d3.easeBackOut(t, 3.0),	// custom overshoot isn't working...why?
			exitDuration = 750,
			exitEase = d3.easeQuad;

		let names = graphContainer.selectAll('.name:not(.timespan)');

		if (!name) {

			names.classed('highlighted', false);
			d3.selectAll('.timespan circle').transition()
				.duration(exitDuration)
				.ease(exitEase)
				.attr('r', 0.01);
			d3.selectAll('.timespan line').transition()
				.duration(exitDuration)
				.ease(exitEase)
				.attr('opacity', 0.0);
			d3.selectAll('.timespan').transition()
				.delay(exitDuration)
				.remove();

			hoverTimespanCircle(null);

		} else {

			let nameElement = names.filter(d => d.key === name);

			// couldn't find it, fail gracefully
			if (nameElement.empty()) return null;

			// already highlighted! nothing to see here, please disperse.
			if (nameElement.classed('highlighted')) return null;

			let nameDatum = nameElement.datum(),

				// modified earlier by force layout, so use this value rather than deriving from data
				nameElementY = parseFloat(nameElement.attr('transform').split(',')[1].split(')')[0]);

			nameElement
				.classed('highlighted', true)
				.raise();

			// insert after any existing timespans, but before all other circles
			let timespan = graphContainer.append('g', '.name:not(.timespan)')
				.attr('class', `name ${ nameDatum.value.sex } timespan`);
				// .style('filter', 'url(#gooey)');

			timespan.append('line')
				.attr('opacity', 1.0)
				.attr('x1', xScale(nameDatum.value.firstYear))
				.attr('y1', nameElementY)
				.attr('x2', xScale(nameDatum.value.lastYear))
				.attr('y2', nameElementY);

			let topOccurrenceIndex = nameDatum.value.occurrences.findIndex(d => d.values[0].fraction === nameDatum.value.maxFraction),
				circles = timespan.selectAll('circle')
				.data(nameDatum.value.occurrences)
			.enter().append('circle')
				.attr('class', d => d.values[0].sex)
				.classed('occurrence', true)
				.classed('top-rank', d => +d.values[0].rank < rankCutoff)
				.attr('cx', d => xScale(d.values[0].year))
				.attr('cy', nameElementY)
				// .attr('cy', d => yScale(nameDatum.value.medianRank))
				// .attr('cy', d => yScale(d.values[0].rank))
				.attr('r', 0.01)
			.transition()
				.delay((d, i) => Math.abs(topOccurrenceIndex - i) * 2)
				.duration(enterDuration)
				.ease(enterEase)
				// .attr('r', d => rScale(d.values[0].fraction));
				.attr('r', d => rScale(d.values[0].count));

			/*
			// immediately open tooltip on clicked circle
			// (close it first if it's already open)
			hoverTimespanCircle(null);
			hoverTimespanCircle(timespan.selectAll('circle').filter((d, i) => i === topOccurrenceIndex));
			*/

		}


	};

	return {
		init
	};

}

export default topNamesScatterplot;
