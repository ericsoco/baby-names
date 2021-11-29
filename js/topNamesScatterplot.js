/*
TODO:
(X) doesn't really work on mobile :/
	(X) preloader is way down screen
	(X) sidebar is jacked, even tho it works in emulator...
(X) get up on gh-pages / babybubbl.es
	(X) unfurl URLs
	(-) redirect from transmote.com/baby-names
		(-) rename /babybubbles
(X) shrink down bundle.js (2.3MB!!)
	(-) consider testing out rollup?
		https://medium.com/@yonester/bundling-with-rollup-the-basics-b782b55f36a8#.b3fr38ily
		http://bl.ocks.org/mbostock/bb09af4c39c79cffcde4
	(X) remove babel-polyfill if not used.
		it's 600KB!
	(-) why is bundle unminified? missing browserify option?
		let's just leave it unminified for people to poke at. only 200KB.
(X) do a little stress testing...
(X) one last bug scrub
	(X) after removing babel-polyfill, check all browsers again
		not using Promises so hopefully ok?
		(X) chrome
		(X) safari
		(X) firefox
(-) fonts race condition:
	sometimes copy block renders before AllerLight font has loaded, and appears as Georgia.
(X) check other browsers
(-) refactor out unused calculations to improve startup time
	( ) no longer need topNames
	( ) no longer need most num/topOccurrences code
(X) responsive-ish
	(X) info-modal
	(X) sidebar
	(X) title
(X) center share dialogs on screen
	http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
(-) add gh-deploy script and deploy on gh-pages
(-) alias that to transmote:
	http://transmote.com/hey-baby (used in social share links)
(X) twitter/facebook/slack unfurl
	(X) markup
	(X) upload image to correct URL
	(X) turn off bot redirection for paths to actual non-portfolio projects
		e.g. http://transmote.com/baby-names
		ideally, whitelist bot redirection instead of blacklisting each project.
		(quick fix, tho, is to blacklist by putting .htaccess in /baby-names/.)
	(X) validate
		(X) fb: https://developers.facebook.com/tools/debug/sharing/?q=http%3A%2F%2Ftransmote.com%2Fbaby-names%2F
		(X) twitter: https://cards-dev.twitter.com/validator
(X) finish info-modal
	(X) close on click outside
	(X) close button ('X')
	(X) close on esc
(X) use aller display for title block?
(X) deselecting a highlighted name scrolls all the way back up to the top of the page
(X) link to GH repo
(X) link to scraper
(X) write copy
		circles appear at year in which name was at its most popular
		circle size represents total number of babies with that name in that year
		copy has to move above/below the fold, not enough room in sidebar.
		(X) something about names that have changed sex:
			ashley, lindsey/lindsay...
			not sure i want to write a lot here, maybe that goes out as a tweet?
		(X) why do circles sometimes move on click?
			x/y positions may be slightly off, due to collision resolution for legibility
		(X) almost entirely male names at the bottom of popularity slider...
		(X) how is popularity calculated / what do ticks values on slider mean?
(X) share icons
	(-) transmote
	(X) facebook
		(-) use FB sdk.js instead?
			https://developers.facebook.com/docs/plugins/share-button
	(X) twitter
		https://dev.twitter.com/web/tweet-button/web-intent
	(X) github (link to source)
	(-) "you might also like" links at lower left, in dropup?
(X) refine design/colors
(X) kill scrollbars
(X) constrain tooltip to viewport width --
	hovering over circle at left/right cuts off tooltip.
(-) fix up other prototypes
	( ) to work with new index.html
	( ) apply styles via top-level class
		in same way as .top-names-scatterplot
	( ) add header to matrix
(X) transition brush to v4 and remove d3 v3
	(-) remaining problem: on brush click/drag,
		d3Selection.event is null and causes null ref error in d3-brush::started().
		is there some issue with how modules are loaded?
		or perhaps incompatible versions of d3-selection...
		may force the "bring all d3.v4 imports up to 1.0+" issue
		--	started this, with d3-selection and then had to do d3-transition as well,
			but didn't fix it...
(X) animate brush to new position
(X) clicking the brush track should center the current extent on click location,
	not select nothing.
(X) max brush extent, to prevent bad perf
(X) bring all d3.v4 imports up to 1.0+
	import only used exports, instead of entire modules
	do this in a new repo clone, to make sure that npm install is setting things up correctly
(X) regression: tooltip doesn't open immediately on click
	happened after implementing circle animation to actual position
(X) display name and overall (all-time) rank somewhere.
	in tooltip?
	somewhere larger / more graphic might be nice
	(X) in tooltip, clear up meaning of numbers.
		NNN (#MM) --> NNN this year (MMth most popular this year)
			Jennifer: #22 overall
			182,123 babies this year
			(#1 this year)
(X) when a circle is clicked, transition it back to its true position
	(from its force-directed position)
(X) loader screen;
	also, format raw html text in sidebar 
(X) bug (regression): displaying name from hash is broken
(X) display tooltip immediately on name click
	tried to do this in highlightName, but commented out cuz it's buggy
	(maybe now that i'm canceling transition, it will work? revisit.)
(X) bug: when clicking to deselect timespan, tooltip fades out
	but is still present and interferes with interaction.
	(-) set to display: none when it's done fading out
	(X) set pointer-events: none on the tooltip
(X) keep circle hover style (bold font) while timespan is open
(X) increase top margin enough to let bubbles at top of graph show in their entirety
(X) name in hash when searched for / clicked
	(X) write to hash
	(X) read hash on load
		this is in progress; see parseHashSelection()
(X) when any name is selected + expanded, all other names fade out
	so that expanded timespan is more legible
(X) change popularity slider to allow display of all names:
	instead of number of occurrences, choose a popularity metric/algorithm, and make slider just a popularity slider.
	algo is something like: add up total (inverse: #1 is worth most) rank in all years
	two pluses:
		1, don't have to explain slider as "occurrences in the top 100 names of each year", it's just popularity (can break it down in text elsewhere)
		2, can show all 7000+ names
	(X) compare with master and make sure this is actually better,
		then merge it!
	(X) size slider thumb on name lookup based on pow scale
	(X) change slider ticks to something useful
(X) refine styles
	(-) gooey-ify spread names?
		http://bl.ocks.org/nbremer/69808ec7ec07542ed7df
	(-) blend modes?
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

/*
// can't import individual modules,
// because of incompatibility with d3-event and babel:
// https://github.com/d3/d3/issues/2733
import * as d3_array from 'd3-array';
import * as d3_axis from 'd3-axis';
import * as d3_brush from 'd3-brush';
import * as d3_collection from 'd3-collection';
import * as d3_ease from 'd3-ease';
import * as d3_force from 'd3-force';
import * as d3_format from 'd3-format';
import * as d3_request from 'd3-request';
import * as d3_scale from 'd3-scale';
import * as d3_selection from 'd3-selection';
import * as d3_transition from 'd3-transition';
const d3 = {
	...d3_array,
	...d3_axis,
	...d3_brush,
	...d3_collection,
	...d3_ease,
	...d3_force,
	...d3_format,
	...d3_request,
	...d3_scale,
	...d3_selection,
	...d3_transition
};
*/

// loading via <script> tag to keep bundle.js size down
// and take advantage of browser cachine
// import * as d3 from 'd3';

import awesomplete from 'awesomplete';

const topNamesScatterplot = () => {

	let margin,
		width,
		height,
		graphContainer,
		sliderScale,
		xScale,
		yScale,
		rScale,
		brush;

	let rankCutoff = 100,
		domains,
		allNames,
		topNames;

	let timespanMouseInteractionDisabled = false,
		timespanMouseInteractionTimeout;
	
	const topOccurrencesMin = 55,
		topOccurrencesSpread = 10;
	const popularityInitVal = 1,
		popularitySpread = 0.03;

	const init = () => {

		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('keydown', onKeyDown);

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
					}, 0)/*,
					popularity: values.reduce((total, d) => {
						return total + +d.rank
					}, 0)*/
				};
			})
			.entries(names);

		// some names have more numTopOccurrences than there are years in the data,
		// due to data errors. clamp them to avoid problems.
		allNames.forEach(name => name.value.numTopOccurrences = Math.min(domains.topOccurrence[1], name.value.numTopOccurrences));

		let namePopularityByYear = d3.nest()
			.key(d => d.year)
				.sortKeys(d3.ascending)
			.rollup(names => names.map(d => ({
				name: d.name,
				sex: d.sex,
				// popularity: 1 - d.rank / (names.length / 2)	// each year has a list of equal length for fe/male
				popularity: d.fraction 							// oops. just use fraction. can probbaly eliminate this rollup altogether.
			})))
			.entries(names);
		/*
		^^ generates:
		[
			{
				key: '1880',
				value: [
					{ name: 'john', popularity: 0.999 }, ...
					{ name: 'mary', popularity: 0.999 }, ...
				]
			}, ...
		]
		*/

		let namePopularity = namePopularityByYear.reduce((acc, yearList) => {
			let numNames = yearList.value.length / 2;
			yearList.value.forEach(d => {
				if (!acc[d.name]) {
					acc[d.name] = {
						// each name can exist for both sexes
						f: [],
						m: []
					};
				}
				acc[d.name][d.sex].push(d.popularity);
			});
			return acc;
		}, {});
		/*
		^^ generates:
		{
			'aaron': {
				'm': [0.8, 0.7, 0.6...],
				'f': [0.0, 0.05, 0.0...]
			}
		}
		*/

		// final popularity is the sum of the name's popularity across all years the name exists in the data.
		// therefore, names that appear more often have higher popularity, and rank per year also factors in.
		allNames.forEach(d => d.value.popularity = namePopularity[d.value.name][d.value.sex].reduce((total, pop) => total += +pop, 0));

		// console.log(allNames.sort((a, b) => b.value.popularity - a.value.popularity).map(d => `${ d.value.name }: ${ d.value.popularity }`));
		// domains.popularity = d3.extent(allNames, d => d.value.popularity);

		// filter down to only the names that have appeared
		// in the top { rankCutoff } at least once
		// topNames = allNames.filter(d => d.value.numTopOccurrences);

		// filter down to the most N popular names of each sex,
		// because there is too little variation in popularity below that
		// to create a legible visualization in this form
		let numNamesPerSex = 1000,
			sexCounters = { m: 0, f: 0 };
		topNames = [];
		allNames.sort((a, b) => b.value.popularity - a.value.popularity)
			.some(name => {
				if (sexCounters[name.value.sex] < numNamesPerSex) {
					topNames.push(name);
					sexCounters[name.value.sex]++;
					name.value.popularityRank = sexCounters[name.value.sex];
				}
				if (sexCounters.m >= 1000 &&
					sexCounters.f >= 1000) {
					return true;
				}
			});
		domains.topPopularity = d3.extent(topNames, d => d.value.popularity);

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

		d3.select('.graph').classed('loading', false);

		let isSmallScreen = window.innerWidth < 768;	// .scss $bp-larger-than-mobile
		initGraph(isSmallScreen);
		initSidebar(isSmallScreen);

	};

	// populate the data-driven parts of the sidebar once the data are ready.
	// static sidebar elements are initialized before bundled js is loaded, in index.html.
	const initSidebar = (isSmallScreen) => {

		let sidebar = d3.select('.top-names-scatterplot .sidebar'),
			sidebarEl = sidebar.node(),
			nameLookupContainer = sidebar.select('.name-lookup'),
			sliderContainer = sidebar.select('.slider'),
			toggleContainer = sidebar.select('.toggles'),
			legendContainer = sidebar.select('.legend'),
			shareContainer = sidebar.select('.share');

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
					popularity: name.value.popularity,
					sex: name.value.sex,
				};
				return acc;
			}, {}),
			nameLookup = new Awesomplete(nameLookupInput,
			{
				list: names,
				// autoFirst: true,
				// sort: (a, b) => valuesByName[b.value].numTopOccurrences - valuesByName[a.value].numTopOccurrences,
				sort: (a, b) => valuesByName[b.value].popularity - valuesByName[a.value].popularity,
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

			let halfBrushHeight = (sliderScale.range()[0] - sliderScale.range()[1]) * popularitySpread;
			let brushHandleSize = [
				Math.max(sliderScale(name.value.popularity) - halfBrushHeight, sliderScale.range()[1]),
				Math.min(sliderScale(name.value.popularity) + halfBrushHeight, sliderScale.range()[0])
			];

			if (brush) {

				// ensure sex toggle is on for selected name
				let sexToggle = toggleContainer.select(`.${name.value.sex}.sex-toggle`).node();
				if (!sexToggle.classList.contains('on')) {
					sexToggle.click();
				}
				
				// move brush to area where names exist
				sidebar.select('.brush').transition()
					.duration(400)
				.call(brush.move, brushHandleSize);

				// highlight name after a delay
				setTimeout(() => {
					addNameToSelection(name.key, false);
				}, 500);

				if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);

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

		// Select all on focus
		nameLookupInput.addEventListener('focus', function (event) {
			this.select();
		});
		nameLookupInput.addEventListener('mouseup', function (event) {
			return false;
		});

		//
		// popularity slider
		// wait one cycle to measure the rest of the elements and fill remaining space
		//
		setTimeout(() => {
			let sliderWidth = 40,
				sliderMargin = {
					top: 20,
					right: 40,
					bottom: 60,
					left: 40
				},
				width = sidebarEl.offsetWidth - sliderMargin.left - sliderMargin.right,
				height = sidebarEl.offsetHeight -
							nameLookupContainer.node().offsetHeight -
							toggleContainer.node().offsetHeight -
							legendContainer.node().offsetHeight -
							(shareContainer.node().offsetHeight + 
								parseFloat(window.getComputedStyle(shareContainer.node()).marginTop.replace('px', ''))
							) -
							sliderMargin.top - sliderMargin.bottom -
							2 * parseFloat(window.getComputedStyle(sidebar.node()).paddingTop.replace('px', '')),
				sliderSvg = sliderContainer.append('svg')
					.attr('width', width + sliderMargin.left + sliderMargin.right)
					.attr('height', height + sliderMargin.top + sliderMargin.bottom)
				.append('g')
					.attr('transform', `translate(${ 0.5 * (width - sliderWidth) + sliderMargin.left },${ sliderMargin.top })`);

			sliderScale = d3.scalePow()
				.exponent(-0.1)
				.clamp(true)
				.domain(domains.topPopularity)
				.range([height, 0]);

			let sliderBackground = sliderSvg.append('rect')
				.attr('class', 'slider-background')
				.attr('width', sliderWidth)
				.attr('height', height);

			let precision = d3.precisionFixed(0.001),
				sliderGrid = sliderSvg.append('g')
					.attr('class', 'slider-background-grid')
					.call(d3.axisLeft()
						.scale(sliderScale)
						.tickSize(-sliderWidth)
						.tickValues([0.001, 0.01, 0.1, 1, 10])
						.tickFormat(d => d3.format(`.${ d3.precisionFixed(d) }f`)(d))
					);

			let sliderExtentY = sliderScale.range().reverse();
			brush = d3.brushY()
				.extent([[0, sliderExtentY[0]], [sliderWidth, sliderExtentY[1]]]);

			let brushSel = sliderSvg.append('g')
				.attr('class', 'brush')
				.call(brush);

			brush.move(brushSel, [
				sliderScale(popularityInitVal) - height * popularitySpread,
				sliderScale(popularityInitVal) + height * popularitySpread
			]);

			let firstFire = true,
				newSelectionCenter,
				maxSelectionSize = height * 8 * popularitySpread;

			brush.on('start', () => {
				// brush mouse down; store mouse location
				if (d3.event.selection && d3.event.selection[0] === d3.event.selection[1]) {
					newSelectionCenter = d3.event.selection[0];
				}
			});

			brush.on('end', () => {

				let brushCenter;

				if (!d3.event.selection) {

					// empty selection (brush clicked);
					// draw new selection of default width around mouse down location
					// or if no mouse down location stored, around initial selection center
					brushCenter = newSelectionCenter || sliderScale(popularityInitVal);
					brush.move(brushSel, [
						brushCenter - height * popularitySpread,
						brushCenter + height * popularitySpread
					]);

				} else {

					if (d3.event.selection[1] - d3.event.selection[0] > maxSelectionSize) {

						// selection is too large;
						// animate back down to a more reasonable size
						brushCenter = d3.event.selection[0] + 0.5 * (d3.event.selection[1] - d3.event.selection[0]);
						brushSel.transition()
							.duration(400)
						.call(brush.move, [
							brushCenter - 0.49 * maxSelectionSize,
							brushCenter + 0.49 * maxSelectionSize
						]);

					} else {

						// valid selection, let 'er rip
						renderNames(!firstFire);

					}
					
				}

				firstFire = false;
				newSelectionCenter = null;

			});

			sliderContainer.append('div')
				.attr('class', 'label')
				.text('Popularity');

			nameLookupInput.focus();

		}, 1);


		//
		// sex toggles
		//
		let togglesContainer = toggleContainer.append('div')
			.classed('toggles-container', true);

		togglesContainer.append('div')
			.attr('class', 'f sex-toggle on')
			.attr('data-sex', 'f')
			.html('<span>female</span>');
		togglesContainer.append('div')
			.attr('class', 'm sex-toggle on')
			.attr('data-sex', 'm')
			.html('<span>male</span>');
		togglesContainer.selectAll('div')
			.on('click', function (event) {
				// disable a button if it's the only one selected
				// (don't allow unselecting all buttons)
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

				renderNames(true);

				if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);
			});

		toggleContainer.append('div')
			.attr('class', 'label')
			.text('Sex');


		// 
		// legend
		// 
		let legendSizes = [2000, 20000, 75000, 200000].reverse(),
			biggestSize = rScale(legendSizes[0]),
			labelHeight = 32;

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

		//
		// share icons
		//
		let sharePopupWindowSize = {
				width: 600,
				height: 400
			},
			shareIcons = [
				{
					icon: 'icon-facebook',
					url: 'https://www.facebook.com/sharer/sharer.php?u=http://babybubbl.es',
					popupConfig: `width=${ sharePopupWindowSize.width },height=${ sharePopupWindowSize.height },scrollbars=no`
				},
				{
					icon: 'icon-twitter',
					url: 'https://twitter.com/intent/tweet?text=Baby names come and go. And come back again. How about yours%3F&url=http://babybubbl.es&hashtags=dataviz,babyname,opendata',
					popupConfig: `width=${ sharePopupWindowSize.width },height=${ sharePopupWindowSize.height },scrollbars=no`
				},
				{
					icon: 'icon-github',
					url: 'https://github.com/ericsoco/baby-names',
					popupConfig: null
				}
			];

		let shareEnter = shareContainer.selectAll('a.share-icon')
			.data(shareIcons)
		.enter();
		let shareLinks = shareEnter.append('a')
			.classed('share-icon', true)
			.attr('href', (d, i) => shareIcons[i].url)
			.attr('target', (d, i) => !shareIcons[i].popupConfig ? '_blank' : null)
		.append('svg')
			.attr('width', 40)
			.attr('height', 40)
		.append('use')
			// Injecting <use> via .html() doesn't work on iOS Safari. wtf???
			.attr('xlink:href', (d, i) => `#${ shareIcons[i].icon }`);
			// .html((d, i) => `<use xlink:href="#${ shareIcons[i].icon }"></use>`);

		shareLinks.nodes().forEach((node, i) => {
			if (shareIcons[i].popupConfig) {
				node.addEventListener('click', event => {
					event.preventDefault();
					event.stopImmediatePropagation();
					let left = 0.5 * (window.innerWidth - sharePopupWindowSize.width),
						top = 0.5 * (window.innerHeight - sharePopupWindowSize.height);
					window.open(shareIcons[i].url, 'share-pop', `${ shareIcons[i].popupConfig },left=${ left },top=${ top }`);
				});
			}
		});

		// info-modal button
		shareContainer.append('div')
			.classed('info-modal-button', true)
		.append('div')
			.text('?')
			.on('click', event => {
				d3.select('#info-modal-container')
					.classed('visible', true);
				if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);
			});

		d3.select('#info-modal-container')
			.on('click', closeInfoModal);

		d3.select('#info-modal .close-button')
			.on('click', closeInfoModal);

		d3.select('#info-modal')
			.on('click', event => {
				if (event) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

	};

	const closeInfoModal = event => {

		d3.select('#info-modal-container')
			.classed('visible', false);

	}

	const onKeyDown = event => {

		if (event.keyCode === 27) {
			if (d3.select('#info-modal-container').classed('visible')) {
				closeInfoModal();
			} else {
				clearSelection();
			}
		}

	};

	const initGraph = (isSmallScreen) => {

		let sidebarEl = d3.select('.top-names-scatterplot .sidebar').node();

		margin = {
			top: 80,
			right: 40,
			bottom: 80,
			left: 95
		};
		width = window.innerWidth - (isSmallScreen ? 0 : sidebarEl.offsetWidth) - margin.left - margin.right;
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

		graphContainer = d3.select('.top-names-scatterplot .graph').html('').append('svg')
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
			.ticks(isSmallScreen ? 4 : null)
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
		//
		// NOTE: this is pretty hacky...initGraphInteraction called only once
		// arbitrarily 2 frames in, but renderNames is hitting a race condition
		// due to sidebar brush not getting created until some time later.

		let frameCount = 0;

		let onRAF = () => {
			frameCount++;

			if (frameCount >= 2) {
				// do this only once
				if (frameCount === 2) {
					initGraphInteraction(xScale, yScale, rScale, margin);
				}

				if (!parseHashSelection()) {
					// if renderNames unsuccessful, try again next frame
					if (!renderNames(false)) {
						window.requestAnimationFrame(onRAF);
					}
				}
			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);

	};

	const renderNames = (clearSel) => {

		if (clearSel) clearSelection();

		let sidebar = d3.select('.top-names-scatterplot .sidebar'),
			brushNode = sidebar.select('.brush').node();
		if (!brushNode) return false;

		// filter down to only the names that have appeared
		// a number of times specified by brush extent
		let nameSliderExtent = d3.brushSelection(brushNode);

		if (!nameSliderExtent) {
			// brush was clicked and selection cleared;
			// set a new selection at the clicked location

			// renderNames();
			return false;
		}

		let popularityExtent = [sliderScale.invert(nameSliderExtent[1]), sliderScale.invert(nameSliderExtent[0])],
			filteredNames = topNames.filter(d => 
				d.value.popularity >= popularityExtent[0] &&
				d.value.popularity <= popularityExtent[1]
			);

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
			.force('collide', d3.forceCollide(d => Math.pow(Math.max(20, rScale(d.value.countAtMaxFraction)), 0.9)))
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

		return true;
	};

	const initGraphInteraction = (xScale, yScale, rScale, margin) => {

		let graphEl = document.querySelector('.top-names-scatterplot .graph'),
			highlightedTimespanCircle = null;

		let clickHandler = event => {
			
			let datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				addNameToSelection(datum.key, true);
			} else {
				clearSelection();
			}

		};
		graphEl.addEventListener('click', clickHandler);
		graphEl.addEventListener('touchend', clickHandler);

		graphEl.addEventListener('mousemove', event => {

			//
			// move year tick on x-axis
			//
			let year = Math.round(xScale.invert(event.pageX - graphEl.offsetLeft - margin.left)),
				yearTick = d3.select('.year-tick');
			yearTick.select('line')
				.attr('x1', xScale(year))
				.attr('x2', xScale(year));
			yearTick.select('text')
				.attr('x', xScale(year))
				.text(year);

			//
			// display tooltip for timespan circles when mouse is proximate
			//
			if (!timespanMouseInteractionDisabled) {
				let x = event.pageX - graphEl.offsetLeft - margin.left,
					y = event.pageY - (graphEl.getBoundingClientRect().top + window.pageYOffset) - margin.top;

				const maxDist = 80;
				let shortestDist = Number.MAX_VALUE,
					closestCircle = null,
					dx, dy, dist,
					allCircles = d3.selectAll('.timespan circle');
				
				allCircles.each(function (d) {
					dx = this.getAttribute('cx') - x;
					dy = this.getAttribute('cy') - y;
					dist = Math.sqrt(dx * dx + dy * dy);

					// don't even bother calculating circle radius if outside of maxDist
					if (dist < maxDist) {
						let rad = Math.max(20, rScale(d.count) * 1.5);
						if (dist < rad && dist < shortestDist) {
							shortestDist = dist;
							closestCircle = this;
						}
					}
				});

				closestCircle = d3.select(closestCircle);
				hoverTimespanCircle(closestCircle, highlightedTimespanCircle);
				highlightedTimespanCircle = closestCircle;
			}

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

	// default duration equal to timespan exit transition duration, plus a bit
	const disableTimespanMouseInteraction = (duration = 1250) => {

		timespanMouseInteractionDisabled = true;
		if (timespanMouseInteractionTimeout) clearTimeout(timespanMouseInteractionTimeout);
		timespanMouseInteractionTimeout = setTimeout(() => timespanMouseInteractionDisabled = false, duration);

	};

	const hoverTimespanCircle = (circleSel, lastCircleSel, closeImmediate) => {

		let tooltip = d3.select('.timespan-tooltip');
		if (!circleSel || !circleSel.size()) {
			if (tooltip.size()) {
				tooltip.transition()
					.delay(closeImmediate ? 0 : 500)
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
			{ name,
			year,
			count,
			rank,
			sex,
			popularityRank } = datum;

		circleSel.classed('highlighted-occurrence', true);
		circleSel.raise();

		if (lastCircleSel && lastCircleSel.node() !== circleSel.node()) {
			lastCircleSel.classed('highlighted-occurrence', false);
		}

		let graphContainer = d3.select('.top-names-scatterplot .graph'),
			tooltipWidth = 128;	// topNamesScatterplot.scss#.timespan-tooltip.min-width;
		tooltip = graphContainer.select('.timespan-tooltip');

		if (!tooltip.size()) {
			tooltip = graphContainer.append('div')
				.classed('timespan-tooltip', true)
			
			let top = tooltip.append('div')
				.classed('top', true);
			top.append('h4');
			top.append('div')
				.classed('overall-rank', true);

			let bottom = tooltip.append('div')
				.classed('bottom', true);
			let yearStats = bottom.append('div')
				.classed('year-stats', true);
			yearStats.append('div')
				.classed('count', true);
			yearStats.append('div')
				.classed('rank', true);
			bottom.append('p')
				.classed('year', true);
		} else {
			// cancel any existing transition
			tooltip.transition()
				.delay(0)
				.duration(0)
				.style('opacity', 1.0);
		}

		let circleY = +circleSel.attr('cy'),
			tooltipLeft = Math.max(0, Math.min(width - 0.5*tooltipWidth,
				 +circleSel.attr('cx') + margin.left - 0.5*tooltipWidth - 10)),
			tooltipTop = circleY > 0.5 * graphContainer.node().offsetHeight ?
				circleY - (margin.top + 10) :
				circleY + (margin.top + 50);

		tooltip.classed(sex, true)
			.classed(sex === 'm' ? 'f' : 'm', false)
			.style('left', `${ tooltipLeft }px`)
			.style('top', `${ tooltipTop }px`)
			.style('opacity', null);
		tooltip.select('h4').text(name);
		tooltip.select('.overall-rank').html(`<span>#${ popularityRank }</span><span>overall</span>`);
		tooltip.select('.count').html(`<span>${ d3.format(',')(count*10) }</span><span>babies</span>`);
		tooltip.select('.rank').text(`#${ rank }`);
		tooltip.select('.year').html(`<span>in</span><span>${ year }</span>`);

		// TODO:
		// add thousands/millions commas
		// popularity as rank, not as calculated value

	};

	const parseHashSelection = () => {

		let names = window.location.hash.slice(1) && window.location.hash.slice(1).split(',');

		// no names in hash, bail
		if (!names || !names.length) return false;

		let nameObjs = names
			.map(n => topNames.find(d => d.key.toLowerCase() === n.toLowerCase()))
			.filter(n => !!n);

		// no matching names found, bail
		if (!nameObjs || !nameObjs.length) return false;

		// brush not yet inited, bail
		if (!brush) return false;

		let sidebar = d3.select('.top-names-scatterplot .sidebar'),
			toggleContainer = sidebar.select('.toggles');

		let halfBrushHeight = (sliderScale.range()[0] - sliderScale.range()[1]) * popularitySpread,
			namePositionExtent = d3.extent(nameObjs, d => sliderScale(d.value.popularity)),
			midPos = namePositionExtent[0] + 0.5 * (namePositionExtent[1] - namePositionExtent[0]);

		// inflate namePositionExtent slightly to ensure inclusion
		let dist = namePositionExtent[1] - namePositionExtent[0],
			namePositionInflator = 0.05;
		namePositionExtent[0] -= namePositionInflator * dist;
		namePositionExtent[1] += namePositionInflator * dist;

		// set the brush extent to the greater of the distance
		// encompassing all names, or the default brush size,
		// and clamp it to sliderScale.range()
		let brushHandleSize = [
			Math.max(Math.min(midPos - halfBrushHeight, namePositionExtent[0]), sliderScale.range()[1]),
			Math.min(Math.max(midPos + halfBrushHeight, namePositionExtent[1]), sliderScale.range()[0])
		];

		// ensure sex toggle is on for selected names
		nameObjs.forEach(name => {
			let sexToggle = toggleContainer.select(`.${name.value.sex}.sex-toggle`).node();
			if (!sexToggle.classList.contains('on')) {
				sexToggle.click();
			}
		});
		
		// wrap in timeout to ensure all slider init has happened,
		// since there are timeouts in slider init within initSidebar.
		// hacky shit, but i'm running out of fucks to give ¯\_(ツ)_/¯
		setTimeout(() => {

			// move brush to area where names exist
			sidebar.select('.brush').transition()
				.duration(400)
			.call(brush.move, brushHandleSize);

			// highlight name after a delay
			setTimeout(() => {
				highlightName(names);
			}, 500);

		}, 100);

		return true;

	}

	const addNameToSelection = (name, removeDupe) => {

		let hash = window.location.hash.slice(1);
		if (hash) {
			hash = hash.split(',');
			let i = hash.indexOf(name);
			if (~i) {
				if (removeDupe) {
					hash.splice(i, 1);
					window.location.hash = hash.join(',');
				}
				return;
			}
			hash.push(name);
		} else {
			hash = [ name ];
		}

		window.location.hash = hash.join(',');

	}

	const onHashChange = event => {

		let names = window.location.hash.slice(1).split(',');
		highlightName(names);

		let oldNames = (event ? event.oldURL : '').split('#');
		if (oldNames.length > 1) {
			oldNames = oldNames[1].split(',')
				.filter(n => !~names.indexOf(n));

			if (oldNames.length && !names.length) {
				// names were removed and there are none left --
				// clear all selection state
				clearSelection(true);
			} else {
				// remove each name individually
				oldNames.forEach(n => unhighlightName(n));
			}
		}

	};

	const clearSelection = (skipHashChange) => {
		// pushState instead of setting hash to avoid scrolling to top of document
		// and have to manually call handler since 'popstate' is only fired on browser back/forward button press
		if (skipHashChange !== true) {
			history.pushState(null, null, '#');
			onHashChange();
		}

		disableTimespanMouseInteraction();
		hoverTimespanCircle(null, null, true);
	};

	const highlightName = name => {

		// TODO: DRY this out -- copied from renderNames()
		const enterDuration = 300,
			enterEase = t => d3.easeBackOut(t, 3.0),	// custom overshoot isn't working...why?
			exitDuration = 750,
			exitEase = d3.easeQuad;

		let names = graphContainer.selectAll('.name:not(.timespan)');

		if (Array.isArray(name)) {
			let remainingNames = name.slice(1);
			if (remainingNames.length) {
				// be defensive, so that as many names get through as possible
				// even if there are errors (there shouldn't be...)
				try {
					highlightName(remainingNames);
				} catch (e) {}
			}
			name = name[0];
		}

		if (!name) {

			names
				.classed('highlighted not-highlighted', false);
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

			hoverTimespanCircle(null, null, true);

		} else {

			let nameElement = names.filter(d => d.key === name);

			// couldn't find it, fail gracefully
			if (nameElement.empty()) return null;

			// already highlighted! nothing to see here, please disperse.
			if (nameElement.classed('highlighted')) return null;

			let nameDatum = nameElement.datum(),
				nameElementY = yScale(nameDatum.value.medianRank);

				// (not using this anymore, now that name animates to true position on click)
				// modified earlier by force layout, so use this value rather than deriving from data
				// nameElementY = parseFloat(nameElement.attr('transform').split(',')[1].split(')')[0]);

			// animate name to true position on click
			// (from force-directed collision avoidance position)
			nameElement.transition()
				.duration(1200)
				.attr('transform', `translate(${ xScale(+nameDatum.value.maxYear) },${ yScale(nameDatum.value.medianRank) })scale(1.0)rotate(0)`);

			nameElement
				.classed('highlighted', true)
				.classed('not-highlighted', false)
				.raise();

			// insert after any existing timespans, but before all other circles
			let timespan = graphContainer.insert('g', '.name:not(.timespan)')
				.datum(name)
				.attr('class', `name ${ nameDatum.value.sex } timespan`);
				// .style('filter', 'url(#gooey)');

			timespan.append('line')
				.attr('opacity', 1.0)
				.attr('x1', xScale(nameDatum.value.firstYear))
				.attr('y1', nameElementY)
				.attr('x2', xScale(nameDatum.value.lastYear))
				.attr('y2', nameElementY);

			// flatten data and pass name overall popularity to each occurrence
			let occurrencesData = nameDatum.value.occurrences.map(o => ({
				...o.values[0],
				popularityRank: nameDatum.value.popularityRank
			}));

			let topOccurrenceIndex = occurrencesData.findIndex(d => d.fraction === nameDatum.value.maxFraction),
				circles = timespan.selectAll('circle')
				.data(occurrencesData)
			.enter().append('circle')
				.attr('class', d => d.sex)
				.classed('occurrence', true)
				.classed('top-rank', d => +d.rank < rankCutoff)
				.attr('cx', d => xScale(d.year))
				.attr('cy', nameElementY)
				.attr('r', 0.01)
			.transition()
				.delay((d, i) => Math.abs(topOccurrenceIndex - i) * 2)
				.duration(enterDuration)
				.ease(enterEase)
				.attr('r', d => rScale(d.count));

			// immediately open tooltip on clicked circle
			// (close it first if it's already open)
			hoverTimespanCircle(null, null, true);
			hoverTimespanCircle(timespan.selectAll('circle').filter((d, i) => i === topOccurrenceIndex));

			// delay tooltip mouse interaction, to keep tooltip on main circle for a bit
			disableTimespanMouseInteraction(500);

			// fade out all unhighlighted names
			graphContainer.selectAll('.name:not(.timespan):not(.highlighted)')
				.classed('not-highlighted', true);

		}

	};

	const unhighlightName = name => {

		let names = graphContainer.selectAll('.name:not(.timespan)'),
			nameElement = names.filter(d => d.key === name);

		// couldn't find it, fail gracefully
		if (nameElement.empty()) return null;

		// not highlighted! nothing to see here, please disperse.
		if (!nameElement.classed('highlighted')) return null;

		nameElement.classed('highlighted', false);

		// TODO: DRY this out -- copied from renderNames()
		const enterDuration = 300,
			enterEase = t => d3.easeBackOut(t, 3.0),	// custom overshoot isn't working...why?
			exitDuration = 750,
			exitEase = d3.easeQuad;

		let nameTimespan = graphContainer.selectAll('.timespan')
			.filter(d => d === name);
		
		nameTimespan.selectAll('circle').transition()
			.duration(exitDuration)
			.ease(exitEase)
			.attr('r', 0.01);
		nameTimespan.selectAll('line').transition()
			.duration(exitDuration)
			.ease(exitEase)
			.attr('opacity', 0.0);
		nameTimespan.transition()
			.delay(exitDuration)
			.remove();

		hoverTimespanCircle(null, null, true);

	};

	return {
		init
	};

}

export default topNamesScatterplot;
