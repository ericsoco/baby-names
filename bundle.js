(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _topNamesScatterplot = require('./topNamesScatterplot');

var _topNamesScatterplot2 = _interopRequireDefault(_topNamesScatterplot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// matrix().init();
// scatterplot().init();
(0, _topNamesScatterplot2.default)().init(); // import 'babel-polyfill';

// import matrix from './matrix';
// import scatterplot from './scatterplot';

},{"./topNamesScatterplot":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                  TODO:
                                                                                                                                                                                                                                                                  ( ) doesn't really work on mobile :/
                                                                                                                                                                                                                                                                  	( ) preloader is way down screen
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

var _awesomplete = require('awesomplete');

var _awesomplete2 = _interopRequireDefault(_awesomplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topNamesScatterplot = function topNamesScatterplot() {

	var margin = void 0,
	    width = void 0,
	    height = void 0,
	    graphContainer = void 0,
	    sliderScale = void 0,
	    xScale = void 0,
	    yScale = void 0,
	    rScale = void 0,
	    brush = void 0;

	var rankCutoff = 100,
	    domains = void 0,
	    allNames = void 0,
	    topNames = void 0;

	var timespanMouseInteractionDisabled = false,
	    timespanMouseInteractionTimeout = void 0;

	var topOccurrencesMin = 55,
	    topOccurrencesSpread = 10;
	var popularityInitVal = 1,
	    popularitySpread = 0.03;

	var init = function init() {

		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('keydown', onKeyDown);

		var loaded = {
			names: null,
			counts: null
		};

		var fileLoaded = function fileLoaded(error, data, key) {

			if (error) throw error;

			loaded[key] = data;
			if (loaded.names && loaded.counts) {
				onDataLoaded(loaded.names, loaded.counts);
			}
		};

		// from: https://www.ssa.gov/cgi-bin/popularnames.cgi,
		// via https://github.com/ericsoco/baby-name-scraper
		d3.csv('./data/all.csv', function (error, data) {
			return fileLoaded(error, data, 'names');
		});

		// from: https://www.ssa.gov/oact/babynames/numberUSbirths.html
		d3.tsv('./data/birthCounts.tsv', function (error, data) {
			return fileLoaded(error, data, 'counts');
		});
	};

	var onDataLoaded = function onDataLoaded(names, counts) {

		domains = {
			year: d3.extent(names, function (d) {
				return +d.year;
			}),
			fraction: [0, d3.max(names, function (d) {
				return +d.fraction;
			})]
			// occurrence: [0, d3.max(allNames, d => d.value.occurrences.length)],
			// rank: [0, d3.max(allNames, d => d.value.medianRank)],
		};
		domains.topOccurrence = [1, Math.floor((domains.year[1] - domains.year[0]) / 10) * 10];

		// calculate amount of each name per year,
		// based on name-year fraction and total count per year
		names.forEach(function (n) {
			return n.count = Math.round(+n.fraction * parseFloat(counts[+n.year - domains.year[0]].total));
		});

		domains.count = d3.extent(names, function (d) {
			return d.count;
		});

		// restructure name data into a more useful format
		allNames = d3.nest().key(function (d) {
			return d.name;
		}).sortKeys(d3.ascending).rollup(function (values) {
			var maxFraction = d3.max(values, function (d) {
				return d.fraction;
			}),
			    maxFractionIndex = d3.scan(values, function (a, b) {
				return b.fraction - a.fraction;
			}),
			    countAtMaxFraction = values[maxFractionIndex].count;

			return {
				name: values[maxFractionIndex].name,
				sex: values[maxFractionIndex].sex,
				firstYear: d3.min(values, function (d) {
					return +d.year;
				}),
				lastYear: d3.max(values, function (d) {
					return +d.year;
				}),
				maxYear: values.find(function (d) {
					return d.fraction === maxFraction;
				}).year,
				maxFraction: maxFraction,
				countAtMaxFraction: countAtMaxFraction,
				medianRank: d3.median(values, function (d) {
					return +d.rank;
				}),
				occurrences: d3.nest().key(function (d) {
					return d.year;
				}).sortKeys(d3.ascending).entries(values),
				numTopOccurrences: values.reduce(function (total, d) {
					return total + (+d.rank < rankCutoff ? 1 : 0);
				}, 0) /*,
          popularity: values.reduce((total, d) => {
          return total + +d.rank
          }, 0)*/
			};
		}).entries(names);

		// some names have more numTopOccurrences than there are years in the data,
		// due to data errors. clamp them to avoid problems.
		allNames.forEach(function (name) {
			return name.value.numTopOccurrences = Math.min(domains.topOccurrence[1], name.value.numTopOccurrences);
		});

		var namePopularityByYear = d3.nest().key(function (d) {
			return d.year;
		}).sortKeys(d3.ascending).rollup(function (names) {
			return names.map(function (d) {
				return {
					name: d.name,
					sex: d.sex,
					// popularity: 1 - d.rank / (names.length / 2)	// each year has a list of equal length for fe/male
					popularity: d.fraction // oops. just use fraction. can probbaly eliminate this rollup altogether.
				};
			});
		}).entries(names);
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

		var namePopularity = namePopularityByYear.reduce(function (acc, yearList) {
			var numNames = yearList.value.length / 2;
			yearList.value.forEach(function (d) {
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
		allNames.forEach(function (d) {
			return d.value.popularity = namePopularity[d.value.name][d.value.sex].reduce(function (total, pop) {
				return total += +pop;
			}, 0);
		});

		// console.log(allNames.sort((a, b) => b.value.popularity - a.value.popularity).map(d => `${ d.value.name }: ${ d.value.popularity }`));
		// domains.popularity = d3.extent(allNames, d => d.value.popularity);

		// filter down to only the names that have appeared
		// in the top { rankCutoff } at least once
		// topNames = allNames.filter(d => d.value.numTopOccurrences);

		// filter down to the most N popular names of each sex,
		// because there is too little variation in popularity below that
		// to create a legible visualization in this form
		var numNamesPerSex = 1000,
		    sexCounters = { m: 0, f: 0 };
		topNames = [];
		allNames.sort(function (a, b) {
			return b.value.popularity - a.value.popularity;
		}).some(function (name) {
			if (sexCounters[name.value.sex] < numNamesPerSex) {
				topNames.push(name);
				sexCounters[name.value.sex]++;
				name.value.popularityRank = sexCounters[name.value.sex];
			}
			if (sexCounters.m >= 1000 && sexCounters.f >= 1000) {
				return true;
			}
		});
		domains.topPopularity = d3.extent(topNames, function (d) {
			return d.value.popularity;
		});

		/*
  // now that we have domains.year, calculate age of each name
  allNames.forEach(d => {
  	d.value.age = domains.year[1] - d.value.firstYear
  });
  domains.age = d3.extent(allNames, d => d.value.age);
  */

		render();
	};

	var render = function render() {

		d3.select('.graph').classed('loading', false);

		var isSmallScreen = window.innerWidth < 768; // .scss $bp-larger-than-mobile
		initGraph(isSmallScreen);
		initSidebar(isSmallScreen);
	};

	// populate the data-driven parts of the sidebar once the data are ready.
	// static sidebar elements are initialized before bundled js is loaded, in index.html.
	var initSidebar = function initSidebar(isSmallScreen) {

		var sidebar = d3.select('.top-names-scatterplot .sidebar'),
		    sidebarEl = sidebar.node(),
		    nameLookupContainer = sidebar.select('.name-lookup'),
		    sliderContainer = sidebar.select('.slider'),
		    toggleContainer = sidebar.select('.toggles'),
		    legendContainer = sidebar.select('.legend'),
		    shareContainer = sidebar.select('.share');

		//
		// name lookup
		//
		var nameLookupInput = nameLookupContainer.append('input').attr('class', 'awesomplete').attr('placeholder', 'Find a name').node();

		var names = topNames.map(function (name) {
			return name.key;
		}),
		    valuesByName = topNames.reduce(function (acc, name) {
			acc[name.key] = {
				numTopOccurrences: name.value.numTopOccurrences,
				popularity: name.value.popularity,
				sex: name.value.sex
			};
			return acc;
		}, {}),
		    nameLookup = new Awesomplete(nameLookupInput, {
			list: names,
			// autoFirst: true,
			// sort: (a, b) => valuesByName[b.value].numTopOccurrences - valuesByName[a.value].numTopOccurrences,
			sort: function sort(a, b) {
				return valuesByName[b.value].popularity - valuesByName[a.value].popularity;
			},
			item: function item(itemText, inputText) {
				var li = Awesomplete.ITEM(itemText, inputText);
				li.classList.add(valuesByName[itemText].sex);
				return li;
			}
		});

		var onNameLookupSelected = function onNameLookupSelected(event) {

			var name = topNames.find(function (d) {
				return d.key.toLowerCase() === event.target.value.toLowerCase();
			});
			if (!name) {
				nameLookupInput.classList.add('not-found');
				setTimeout(function () {
					nameLookupInput.classList.remove('not-found');
				}, 1);
				return;
			}

			var halfBrushHeight = (sliderScale.range()[0] - sliderScale.range()[1]) * popularitySpread;
			var brushHandleSize = [Math.max(sliderScale(name.value.popularity) - halfBrushHeight, sliderScale.range()[1]), Math.min(sliderScale(name.value.popularity) + halfBrushHeight, sliderScale.range()[0])];

			if (brush) {

				// ensure sex toggle is on for selected name
				var sexToggle = toggleContainer.select('.' + name.value.sex + '.sex-toggle').node();
				if (!sexToggle.classList.contains('on')) {
					sexToggle.click();
				}

				// move brush to area where names exist
				sidebar.select('.brush').transition().duration(400).call(brush.move, brushHandleSize);

				// highlight name after a delay
				setTimeout(function () {
					addNameToSelection(name.key);
				}, 500);

				if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);
			}
		};

		window.addEventListener('awesomplete-selectcomplete', onNameLookupSelected);

		// handle enter keypress
		nameLookupInput.addEventListener('keypress', function (event) {
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
		setTimeout(function () {
			var sliderWidth = 40,
			    sliderMargin = {
				top: 20,
				right: 40,
				bottom: 60,
				left: 40
			},
			    width = sidebarEl.offsetWidth - sliderMargin.left - sliderMargin.right,
			    height = sidebarEl.offsetHeight - nameLookupContainer.node().offsetHeight - toggleContainer.node().offsetHeight - legendContainer.node().offsetHeight - (shareContainer.node().offsetHeight + parseFloat(window.getComputedStyle(shareContainer.node()).marginTop.replace('px', ''))) - sliderMargin.top - sliderMargin.bottom - 2 * parseFloat(window.getComputedStyle(sidebar.node()).paddingTop.replace('px', '')),
			    sliderSvg = sliderContainer.append('svg').attr('width', width + sliderMargin.left + sliderMargin.right).attr('height', height + sliderMargin.top + sliderMargin.bottom).append('g').attr('transform', 'translate(' + (0.5 * (width - sliderWidth) + sliderMargin.left) + ',' + sliderMargin.top + ')');

			sliderScale = d3.scalePow().exponent(-0.1).clamp(true).domain(domains.topPopularity).range([height, 0]);

			var sliderBackground = sliderSvg.append('rect').attr('class', 'slider-background').attr('width', sliderWidth).attr('height', height);

			var precision = d3.precisionFixed(0.001),
			    sliderGrid = sliderSvg.append('g').attr('class', 'slider-background-grid').call(d3.axisLeft().scale(sliderScale).tickSize(-sliderWidth).tickValues([0.001, 0.01, 0.1, 1, 10]).tickFormat(function (d) {
				return d3.format('.' + d3.precisionFixed(d) + 'f')(d);
			}));

			var sliderExtentY = sliderScale.range().reverse();
			brush = d3.brushY().extent([[0, sliderExtentY[0]], [sliderWidth, sliderExtentY[1]]]);

			var brushSel = sliderSvg.append('g').attr('class', 'brush').call(brush);

			brush.move(brushSel, [sliderScale(popularityInitVal) - height * popularitySpread, sliderScale(popularityInitVal) + height * popularitySpread]);

			var firstFire = true,
			    newSelectionCenter = void 0,
			    maxSelectionSize = height * 8 * popularitySpread;

			brush.on('start', function () {
				// brush mouse down; store mouse location
				if (d3.event.selection && d3.event.selection[0] === d3.event.selection[1]) {
					newSelectionCenter = d3.event.selection[0];
				}
			});

			brush.on('end', function () {

				var brushCenter = void 0;

				if (!d3.event.selection) {

					// empty selection (brush clicked);
					// draw new selection of default width around mouse down location
					// or if no mouse down location stored, around initial selection center
					brushCenter = newSelectionCenter || sliderScale(popularityInitVal);
					brush.move(brushSel, [brushCenter - height * popularitySpread, brushCenter + height * popularitySpread]);
				} else {

					if (d3.event.selection[1] - d3.event.selection[0] > maxSelectionSize) {

						// selection is too large;
						// animate back down to a more reasonable size
						brushCenter = d3.event.selection[0] + 0.5 * (d3.event.selection[1] - d3.event.selection[0]);
						brushSel.transition().duration(400).call(brush.move, [brushCenter - 0.49 * maxSelectionSize, brushCenter + 0.49 * maxSelectionSize]);
					} else {

						// valid selection, let 'er rip
						renderNames(!firstFire);
					}
				}

				firstFire = false;
				newSelectionCenter = null;
			});

			sliderContainer.append('div').attr('class', 'label').text('Popularity');
		}, 1);

		//
		// sex toggles
		//
		var togglesContainer = toggleContainer.append('div').classed('toggles-container', true);

		togglesContainer.append('div').attr('class', 'f sex-toggle on').attr('data-sex', 'f').html('<span>female</span>');
		togglesContainer.append('div').attr('class', 'm sex-toggle on').attr('data-sex', 'm').html('<span>male</span>');
		togglesContainer.selectAll('div').on('click', function (event) {
			// disable a button if it's the only one selected
			// (don't allow unselecting all buttons)
			if (!this.classList.contains('disabled')) {
				this.classList.toggle('on');
			}

			var selectedToggles = d3.selectAll('.top-names-scatterplot .sex-toggle.on');
			if (selectedToggles.size() === 1) {
				selectedToggles.classed('disabled', true);
			} else {
				d3.selectAll('.top-names-scatterplot .sex-toggle').classed('disabled', false);
			}

			renderNames(true);

			if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);
		});

		toggleContainer.append('div').attr('class', 'label').text('Sex');

		// 
		// legend
		// 
		var legendSizes = [2000, 20000, 75000, 200000].reverse(),
		    biggestSize = rScale(legendSizes[0]),
		    labelHeight = 32;

		var legendMargin = {
			left: 20,
			right: 20
		},
		    legendWidth = sidebarEl.offsetWidth - legendMargin.left - legendMargin.right,
		    legendStrokeWidth = 2,
		    legendSvg = legendContainer.append('svg').attr('width', legendWidth).attr('height', 2 * biggestSize + 2 * legendStrokeWidth + labelHeight).append('g').attr('transform', 'translate(' + 0.5 * legendWidth + ',0)');

		var legendSel = legendSvg.selectAll('g.legend-item').data(legendSizes);
		var legendEnter = legendSel.enter().append('g').classed('legend-item', true).attr('transform', 'translate(0,' + legendStrokeWidth + ')');
		legendEnter.append('circle').attr('cx', 0).attr('cy', function (d) {
			return rScale(d);
		}).attr('r', function (d) {
			return rScale(d);
		});
		legendEnter.append('text').attr('x', 0).attr('y', function (d) {
			return 2 * rScale(d) + 12;
		}).text(function (d) {
			return d / 1000 + 'k';
		});

		legendContainer.append('div').attr('class', 'label').text('Babies per year');

		//
		// share icons
		//
		var sharePopupWindowSize = {
			width: 600,
			height: 400
		},
		    shareIcons = [{
			icon: 'icon-facebook',
			url: 'https://www.facebook.com/sharer/sharer.php?u=http://transmote.com/hey-baby',
			popupConfig: 'width=' + sharePopupWindowSize.width + ',height=' + sharePopupWindowSize.height + ',scrollbars=no'
		}, {
			icon: 'icon-twitter',
			url: 'https://twitter.com/intent/tweet?text=Baby names come and go. And come back again. How about yours?&url=http://transmote.com/hey-baby&hashtags=dataviz,babyname,opendata',
			popupConfig: 'width=' + sharePopupWindowSize.width + ',height=' + sharePopupWindowSize.height + ',scrollbars=no'
		}, {
			icon: 'icon-github',
			url: 'https://github.com/ericsoco/baby-names',
			popupConfig: null
		}];

		var shareEnter = shareContainer.selectAll('a.share-icon').data(shareIcons).enter();
		var shareLinks = shareEnter.append('a').classed('share-icon', true).attr('href', function (d, i) {
			return shareIcons[i].url;
		}).attr('target', function (d, i) {
			return !shareIcons[i].popupConfig ? '_blank' : null;
		}).append('svg').attr('width', 40).attr('height', 40).html(function (d, i) {
			return '<use xlink:href="#' + shareIcons[i].icon + '" />';
		});

		shareLinks.nodes().forEach(function (node, i) {
			if (shareIcons[i].popupConfig) {
				node.addEventListener('click', function (event) {
					event.preventDefault();
					event.stopImmediatePropagation();
					var left = 0.5 * (window.innerWidth - sharePopupWindowSize.width),
					    top = 0.5 * (window.innerHeight - sharePopupWindowSize.height);
					window.open(shareIcons[i].url, 'share-pop', shareIcons[i].popupConfig + ',left=' + left + ',top=' + top);
				});
			}
		});

		// info-modal button
		shareContainer.append('div').classed('info-modal-button', true).append('div').text('?').on('click', function (event) {
			d3.select('#info-modal-container').classed('visible', true);
			if (isSmallScreen) window.scrollTo(0, document.body.scrollHeight);
		});

		d3.select('#info-modal-container').on('click', closeInfoModal);

		d3.select('#info-modal .close-button').on('click', closeInfoModal);

		d3.select('#info-modal').on('click', function (event) {
			if (event) {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		});
	};

	var closeInfoModal = function closeInfoModal(event) {

		d3.select('#info-modal-container').classed('visible', false);
	};

	var onKeyDown = function onKeyDown(event) {

		if (event.keyCode === 27) {
			if (d3.select('#info-modal-container').classed('visible')) {
				closeInfoModal();
			} else {
				clearSelection();
			}
		}
	};

	var initGraph = function initGraph(isSmallScreen) {

		var sidebarEl = d3.select('.top-names-scatterplot .sidebar').node();

		margin = {
			top: 80,
			right: 40,
			bottom: 80,
			left: 95
		};
		width = window.innerWidth - (isSmallScreen ? 0 : sidebarEl.offsetWidth) - margin.left - margin.right;
		height = window.innerHeight - margin.top - margin.bottom;

		xScale = d3.scaleLinear().clamp(true).domain(domains.year).range([0, width]);

		yScale = d3.scaleLinear()
		// .domain(domains.rank)
		.domain([0, 800]).range([0, height]);

		rScale = d3.scalePow().exponent(0.5)
		// .domain(domains.fraction)
		.domain(domains.count).range([5, 80]);

		graphContainer = d3.select('.top-names-scatterplot .graph').html('').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// 'gooey' filter from http://bl.ocks.org/nbremer/69808ec7ec07542ed7df
		var defs = d3.select('.top-names-scatterplot .graph svg').append('defs');
		var filter = defs.append('filter').attr('id', 'gooey');
		filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '3').attr('result', 'blur');
		filter.append('feColorMatrix').attr('in', 'blur').attr('mode', 'matrix').attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7').attr('result', 'gooey');
		filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'gooey').attr('operator', 'atop');

		var xAxis = d3.axisBottom().scale(xScale).ticks(isSmallScreen ? 4 : null).tickFormat(d3.format('d'));
		var xAxisEl = graphContainer.append('g').classed('x axis', true).attr('transform', 'translate(0,' + (height + 40) + ')').call(xAxis);
		xAxisEl.append('text').classed('label', true).attr('x', width).attr('y', -10).style('text-anchor', 'end').text('Year');

		var yearTick = xAxisEl.append('g').attr('class', 'year-tick');
		yearTick.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -10).attr('y2', 0);
		yearTick.append('text').attr('x', 0).attr('y', -20);

		var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('d'));
		graphContainer.append('g').classed('y axis', true).attr('transform', 'translate(-40,0)').call(yAxis).append('text').classed('label', true).attr('transform', 'rotate(-90)').attr('x', 0).attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text('Median rank');

		// wait to build and render circles until after axes have rendered.
		// wait two frames to ensure stack has cleared and DOM has updated+rendered.
		var frameCount = 0;

		var onRAF = function onRAF() {
			frameCount++;

			if (frameCount === 2) {

				if (!parseHashSelection()) {
					renderNames(false);
				}

				initGraphInteraction(xScale, yScale, rScale, margin);
			} else {
				window.requestAnimationFrame(onRAF);
			}
		};
		window.requestAnimationFrame(onRAF);
	};

	var renderNames = function renderNames(clearSel) {

		if (clearSel) clearSelection();

		// filter down to only the names that have appeared
		// a number of times specified by brush extent
		var sidebar = d3.select('.top-names-scatterplot .sidebar'),
		    nameSliderExtent = d3.brushSelection(sidebar.select('.brush').node());

		if (!nameSliderExtent) {
			// brush was clicked and selection cleared;
			// set a new selection at the clicked location

			console.log(">>>>> TODO: set new selection");

			// renderNames();
			return;
		}

		var popularityExtent = [sliderScale.invert(nameSliderExtent[1]), sliderScale.invert(nameSliderExtent[0])],
		    filteredNames = topNames.filter(function (d) {
			return d.value.popularity >= popularityExtent[0] && d.value.popularity <= popularityExtent[1];
		});

		// filter to only selected sexes
		var sexToggles = d3.selectAll('.top-names-scatterplot .sex-toggle').nodes().reduce(function (acc, el) {
			acc[el.dataset.sex] = el.classList.contains('on');
			return acc;
		}, {});
		filteredNames = filteredNames.filter(function (d) {
			return sexToggles[d.value.sex];
		});

		var enterDuration = 300,
		    enterEase = function enterEase(t) {
			return d3.easeBackOut(t, 3.0);
		},
		    // custom overshoot isn't working...why?
		exitDuration = 750,
		    exitEase = d3.easeQuad;

		var simulation = d3.forceSimulation(filteredNames).force('x', d3.forceX(function (d) {
			return xScale(d.value.maxYear);
		}).strength(1)).force('y', d3.forceY(function (d) {
			return yScale(d.value.medianRank);
		}).strength(1)).force('collide', d3.forceCollide(function (d) {
			return Math.pow(Math.max(20, rScale(d.value.countAtMaxFraction)), 0.9);
		})).stop();
		for (var i = 0; i < 120; ++i) {
			simulation.tick();
		}var namePlots = graphContainer.selectAll('.name:not(.timespan)').data(filteredNames, function (d) {
			return d.key;
		});

		// update
		// namePlots.transition()
		// 	.attr();

		// enter
		var namePlotsEnter = namePlots.enter().append('g').attr('class', function (d) {
			return 'name ' + d.value.sex;
		}).attr('transform', function (d) {
			return 'translate(' + Math.max(0, Math.min(width, d.x)) + ',' + Math.max(0, Math.min(height, d.y)) + ')scale(0.01)rotate(0)';
		}).attr('opacity', 0.0);
		namePlotsEnter.transition().duration(enterDuration).ease(enterEase).attr('transform', function (d) {
			return 'translate(' + Math.max(0, Math.min(width, d.x)) + ',' + Math.max(0, Math.min(height, d.y)) + ')scale(1.0)rotate(0)';
		}).attr('opacity', 1.0);
		namePlotsEnter.append('circle').attr('cx', 0).attr('cy', 0)
		// .attr('r', d => rScale(d.value.maxFraction));
		.attr('r', function (d) {
			return rScale(d.value.countAtMaxFraction);
		});
		namePlotsEnter.append('text').attr('x', 0).attr('y', 5).text(function (d) {
			return d.value.name;
		});

		// exit
		namePlots.exit().transition().duration(exitDuration).ease(exitEase).attr('transform', function (d) {
			return 'translate(' + d.x + ',' + d.y + ')scale(0.01)rotate(0)';
		}).attr('opacity', 0.0).remove();
	};

	var initGraphInteraction = function initGraphInteraction(xScale, yScale, rScale, margin) {

		var graphEl = document.querySelector('.top-names-scatterplot .graph'),
		    highlightedTimespanCircle = null;

		graphEl.addEventListener('click', function (event) {

			var datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				addNameToSelection(datum.key);
			} else {
				clearSelection();
			}
		});

		graphEl.addEventListener('mousemove', function (event) {

			//
			// move year tick on x-axis
			//
			var year = Math.round(xScale.invert(event.pageX - graphEl.offsetLeft - margin.left)),
			    yearTick = d3.select('.year-tick');
			yearTick.select('line').attr('x1', xScale(year)).attr('x2', xScale(year));
			yearTick.select('text').attr('x', xScale(year)).text(year);

			//
			// display tooltip for timespan circles when mouse is proximate
			//
			if (!timespanMouseInteractionDisabled) {
				(function () {
					var x = event.pageX - graphEl.offsetLeft - margin.left,
					    y = event.pageY - (graphEl.getBoundingClientRect().top + window.pageYOffset) - margin.top;

					var maxDist = 80;
					var shortestDist = Number.MAX_VALUE,
					    closestCircle = null,
					    dx = void 0,
					    dy = void 0,
					    dist = void 0,
					    allCircles = d3.selectAll('.timespan circle');

					allCircles.each(function (d) {
						dx = this.getAttribute('cx') - x;
						dy = this.getAttribute('cy') - y;
						dist = Math.sqrt(dx * dx + dy * dy);

						// don't even bother calculating circle radius if outside of maxDist
						if (dist < maxDist) {
							var rad = Math.max(20, rScale(d.count) * 1.5);
							if (dist < rad && dist < shortestDist) {
								shortestDist = dist;
								closestCircle = this;
							}
						}
					});

					closestCircle = d3.select(closestCircle);
					hoverTimespanCircle(closestCircle, highlightedTimespanCircle);
					highlightedTimespanCircle = closestCircle;
				})();
			}
		});

		graphEl.addEventListener('mouseover', function (event) {

			var datum = d3.select(event.target).datum();
			if (datum && datum.key) {
				if (!event.target.classList.contains('occurrence')) {
					hoverName(datum.key);
				}
			} else {
				hoverName(null);
			}
		});
	};

	var hoverName = function hoverName(name) {

		var names = graphContainer.selectAll('.name:not(.timespan)').classed('hover', false);

		if (name) {
			names.filter(function (d) {
				return d.key === name;
			}).classed('hover', true).raise();
		}
	};

	// default duration equal to timespan exit transition duration, plus a bit
	var disableTimespanMouseInteraction = function disableTimespanMouseInteraction() {
		var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1250;


		timespanMouseInteractionDisabled = true;
		if (timespanMouseInteractionTimeout) clearTimeout(timespanMouseInteractionTimeout);
		timespanMouseInteractionTimeout = setTimeout(function () {
			return timespanMouseInteractionDisabled = false;
		}, duration);
	};

	var hoverTimespanCircle = function hoverTimespanCircle(circleSel, lastCircleSel, closeImmediate) {

		var tooltip = d3.select('.timespan-tooltip');
		if (!circleSel || !circleSel.size()) {
			if (tooltip.size()) {
				tooltip.transition().delay(closeImmediate ? 0 : 500).duration(500).style('opacity', 0.0).remove();
			}

			if (lastCircleSel && lastCircleSel.node() !== circleSel.node()) {
				lastCircleSel.classed('highlighted-occurrence', false);
			}

			return;
		}

		var datum = circleSel.datum();
		var name = datum.name;
		var year = datum.year;
		var count = datum.count;
		var rank = datum.rank;
		var sex = datum.sex;
		var popularityRank = datum.popularityRank;


		circleSel.classed('highlighted-occurrence', true);
		circleSel.raise();

		if (lastCircleSel && lastCircleSel.node() !== circleSel.node()) {
			lastCircleSel.classed('highlighted-occurrence', false);
		}

		var graphContainer = d3.select('.top-names-scatterplot .graph'),
		    tooltipWidth = 128; // topNamesScatterplot.scss#.timespan-tooltip.min-width;
		tooltip = graphContainer.select('.timespan-tooltip');

		if (!tooltip.size()) {
			tooltip = graphContainer.append('div').classed('timespan-tooltip', true);

			var top = tooltip.append('div').classed('top', true);
			top.append('h4');
			top.append('div').classed('overall-rank', true);

			var bottom = tooltip.append('div').classed('bottom', true);
			var yearStats = bottom.append('div').classed('year-stats', true);
			yearStats.append('div').classed('count', true);
			yearStats.append('div').classed('rank', true);
			bottom.append('p').classed('year', true);
		} else {
			// cancel any existing transition
			tooltip.transition().delay(0).duration(0).style('opacity', 1.0);
		}

		var circleY = +circleSel.attr('cy'),
		    tooltipLeft = Math.max(0, Math.min(width - 0.5 * tooltipWidth, +circleSel.attr('cx') + margin.left - 0.5 * tooltipWidth - 10)),
		    tooltipTop = circleY > 0.5 * graphContainer.node().offsetHeight ? circleY - (margin.top + 10) : circleY + (margin.top + 50);

		tooltip.classed(sex, true).classed(sex === 'm' ? 'f' : 'm', false).style('left', tooltipLeft + 'px').style('top', tooltipTop + 'px').style('opacity', null);
		tooltip.select('h4').text(name);
		tooltip.select('.overall-rank').html('<span>#' + popularityRank + '</span><span>overall</span>');
		tooltip.select('.count').html('<span>' + d3.format(',')(count * 10) + '</span><span>babies</span>');
		tooltip.select('.rank').text('#' + rank);
		tooltip.select('.year').html('<span>in</span><span>' + year + '</span>');

		// TODO:
		// add thousands/millions commas
		// popularity as rank, not as calculated value
	};

	var parseHashSelection = function parseHashSelection() {

		var names = window.location.hash.slice(1) && window.location.hash.slice(1).split(',');

		// no names in hash, bail
		if (!names || !names.length) return false;

		var nameObjs = names.map(function (n) {
			return topNames.find(function (d) {
				return d.key.toLowerCase() === n.toLowerCase();
			});
		}).filter(function (n) {
			return !!n;
		});

		// no matching names found, bail
		if (!nameObjs || !nameObjs.length) return false;

		// brush not yet inited, bail
		if (!brush) return false;

		var sidebar = d3.select('.top-names-scatterplot .sidebar'),
		    toggleContainer = sidebar.select('.toggles');

		var halfBrushHeight = (sliderScale.range()[0] - sliderScale.range()[1]) * popularitySpread,
		    namePositionExtent = d3.extent(nameObjs, function (d) {
			return sliderScale(d.value.popularity);
		}),
		    midPos = namePositionExtent[0] + 0.5 * (namePositionExtent[1] - namePositionExtent[0]);

		// inflate namePositionExtent slightly to ensure inclusion
		var dist = namePositionExtent[1] - namePositionExtent[0],
		    namePositionInflator = 0.05;
		namePositionExtent[0] -= namePositionInflator * dist;
		namePositionExtent[1] += namePositionInflator * dist;

		// set the brush extent to the greater of the distance
		// encompassing all names, or the default brush size,
		// and clamp it to sliderScale.range()
		var brushHandleSize = [Math.max(Math.min(midPos - halfBrushHeight, namePositionExtent[0]), sliderScale.range()[1]), Math.min(Math.max(midPos + halfBrushHeight, namePositionExtent[1]), sliderScale.range()[0])];

		// ensure sex toggle is on for selected names
		nameObjs.forEach(function (name) {
			var sexToggle = toggleContainer.select('.' + name.value.sex + '.sex-toggle').node();
			if (!sexToggle.classList.contains('on')) {
				sexToggle.click();
			}
		});

		// wrap in timeout to ensure all slider init has happened,
		// since there are timeouts in slider init within initSidebar.
		// hacky shit, but i'm running out of fucks to give ¯\_(ツ)_/¯
		setTimeout(function () {

			// move brush to area where names exist
			sidebar.select('.brush').transition().duration(400).call(brush.move, brushHandleSize);

			// highlight name after a delay
			setTimeout(function () {
				highlightName(names);
			}, 500);
		}, 100);

		return true;
	};

	var addNameToSelection = function addNameToSelection(name) {
		var hash = window.location.hash.slice(1);
		if (hash) hash += ',';
		window.location.hash = hash + name;
	};

	var onHashChange = function onHashChange(event) {

		var name = window.location.hash.slice(1);
		highlightName(name.split(','));
	};

	var clearSelection = function clearSelection() {
		// pushState instead of setting hash to avoid scrolling to top of document
		// and have to manually call handler since 'popstate' is only fired on browser back/forward button press
		history.pushState(null, null, '#');
		onHashChange();

		disableTimespanMouseInteraction();
		hoverTimespanCircle(null, null, true);
	};

	var highlightName = function highlightName(name) {

		// TODO: DRY this out -- copied from renderNames()
		var enterDuration = 300,
		    enterEase = function enterEase(t) {
			return d3.easeBackOut(t, 3.0);
		},
		    // custom overshoot isn't working...why?
		exitDuration = 750,
		    exitEase = d3.easeQuad;

		var names = graphContainer.selectAll('.name:not(.timespan)');

		if (Array.isArray(name)) {
			var remainingNames = name.slice(1);
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

			names.classed('highlighted not-highlighted', false);
			d3.selectAll('.timespan circle').transition().duration(exitDuration).ease(exitEase).attr('r', 0.01);
			d3.selectAll('.timespan line').transition().duration(exitDuration).ease(exitEase).attr('opacity', 0.0);
			d3.selectAll('.timespan').transition().delay(exitDuration).remove();

			hoverTimespanCircle(null, null, true);
		} else {
			var _ret2 = function () {

				var nameElement = names.filter(function (d) {
					return d.key === name;
				});

				// couldn't find it, fail gracefully
				if (nameElement.empty()) return {
						v: null
					};

				// already highlighted! nothing to see here, please disperse.
				if (nameElement.classed('highlighted')) return {
						v: null
					};

				var nameDatum = nameElement.datum(),
				    nameElementY = yScale(nameDatum.value.medianRank);

				// (not using this anymore, now that name animates to true position on click)
				// modified earlier by force layout, so use this value rather than deriving from data
				// nameElementY = parseFloat(nameElement.attr('transform').split(',')[1].split(')')[0]);

				// animate name to true position on click
				// (from force-directed collision avoidance position)
				nameElement.transition().duration(1200).attr('transform', 'translate(' + xScale(+nameDatum.value.maxYear) + ',' + yScale(nameDatum.value.medianRank) + ')scale(1.0)rotate(0)');

				nameElement.classed('highlighted', true).classed('not-highlighted', false).raise();

				// insert after any existing timespans, but before all other circles
				var timespan = graphContainer.insert('g', '.name:not(.timespan)').attr('class', 'name ' + nameDatum.value.sex + ' timespan');
				// .style('filter', 'url(#gooey)');

				timespan.append('line').attr('opacity', 1.0).attr('x1', xScale(nameDatum.value.firstYear)).attr('y1', nameElementY).attr('x2', xScale(nameDatum.value.lastYear)).attr('y2', nameElementY);

				// flatten data and pass name overall popularity to each occurrence
				var occurrencesData = nameDatum.value.occurrences.map(function (o) {
					return _extends({}, o.values[0], {
						popularityRank: nameDatum.value.popularityRank
					});
				});

				var topOccurrenceIndex = occurrencesData.findIndex(function (d) {
					return d.fraction === nameDatum.value.maxFraction;
				}),
				    circles = timespan.selectAll('circle').data(occurrencesData).enter().append('circle').attr('class', function (d) {
					return d.sex;
				}).classed('occurrence', true).classed('top-rank', function (d) {
					return +d.rank < rankCutoff;
				}).attr('cx', function (d) {
					return xScale(d.year);
				}).attr('cy', nameElementY).attr('r', 0.01).transition().delay(function (d, i) {
					return Math.abs(topOccurrenceIndex - i) * 2;
				}).duration(enterDuration).ease(enterEase).attr('r', function (d) {
					return rScale(d.count);
				});

				// immediately open tooltip on clicked circle
				// (close it first if it's already open)
				hoverTimespanCircle(null, null, true);
				hoverTimespanCircle(timespan.selectAll('circle').filter(function (d, i) {
					return i === topOccurrenceIndex;
				}));

				// delay tooltip mouse interaction, to keep tooltip on main circle for a bit
				disableTimespanMouseInteraction(500);

				// fade out all unhighlighted names
				graphContainer.selectAll('.name:not(.timespan):not(.highlighted)').classed('not-highlighted', true);
			}();

			if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
		}
	};

	return {
		init: init
	};
};

exports.default = topNamesScatterplot;

},{"awesomplete":3}],3:[function(require,module,exports){
/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 */

(function () {

var _ = function (input, o) {
	var me = this;

	// Setup

	this.input = $(input);
	this.input.setAttribute("autocomplete", "off");
	this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure(this, {
		minChars: 2,
		maxItems: 10,
		autoFirst: false,
		data: _.DATA,
		filter: _.FILTER_CONTAINS,
		sort: _.SORT_BYLENGTH,
		item: _.ITEM,
		replace: _.REPLACE
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "hidden",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this, { reason: "blur" }),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter
					evt.preventDefault();
					me.select();
				}
				else if (c === 27) { // Esc
					me.close({ reason: "esc" });
				}
				else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this, { reason: "submit" })});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li && evt.button === 0) {  // Only select on left click
				evt.preventDefault();
				me.select(li, evt.target);
			}
		}
	}});

	if (this.input.hasAttribute("list")) {
		this.list = "#" + this.input.getAttribute("list");
		this.input.removeAttribute("list");
	}
	else {
		this.list = this.input.getAttribute("data-list") || o.list || [];
	}

	_.all.push(this);
};

_.prototype = {
	set list(list) {
		if (Array.isArray(list)) {
			this._list = list;
		}
		else if (typeof list === "string" && list.indexOf(",") > -1) {
				this._list = list.split(/\s*,\s*/);
		}
		else { // Element or CSS selector
			list = $(list);

			if (list && list.children) {
				var items = [];
				slice.apply(list.children).forEach(function (el) {
					if (!el.disabled) {
						var text = el.textContent.trim();
						var value = el.value || text;
						var label = el.label || text;
						if (value !== "") {
							items.push({ label: label, value: value });
						}
					}
				});
				this._list = items;
			}
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},

	get selected() {
		return this.index > -1;
	},

	get opened() {
		return !this.ul.hasAttribute("hidden");
	},

	close: function (o) {
		if (!this.opened) {
			return;
		}

		this.ul.setAttribute("hidden", "");
		this.index = -1;

		$.fire(this.input, "awesomplete-close", o || {});
	},

	open: function () {
		this.ul.removeAttribute("hidden");

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;

		this.goto(this.index < count - 1? this.index + 1 : -1);
	},

	previous: function () {
		var count = this.ul.children.length;

		this.goto(this.selected? this.index - 1 : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;

			$.fire(this.input, "awesomplete-highlight", {
				text: this.suggestions[this.index]
			});
		}
	},

	select: function (selected, origin) {
		if (selected) {
			this.index = $.siblingIndex(selected);
		} else {
			selected = this.ul.children[this.index];
		}

		if (selected) {
			var suggestion = this.suggestions[this.index];

			var allowed = $.fire(this.input, "awesomplete-select", {
				text: suggestion,
				origin: origin || selected
			});

			if (allowed) {
				this.replace(suggestion);
				this.close({ reason: "select" });
				$.fire(this.input, "awesomplete-selectcomplete", {
					text: suggestion
				});
			}
		}
	},

	evaluate: function() {
		var me = this;
		var value = this.input.value;

		if (value.length >= this.minChars && this._list.length > 0) {
			this.index = -1;
			// Populate list with options that match
			this.ul.innerHTML = "";

			this.suggestions = this._list
				.map(function(item) {
					return new Suggestion(me.data(item, value));
				})
				.filter(function(item) {
					return me.filter(item, value);
				})
				.sort(this.sort)
				.slice(0, this.maxItems);

			this.suggestions.forEach(function(text) {
					me.ul.appendChild(me.item(text, value));
				});

			if (this.ul.children.length === 0) {
				this.close({ reason: "nomatches" });
			} else {
				this.open();
			}
		}
		else {
			this.close({ reason: "nomatches" });
		}
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

_.ITEM = function (text, input) {
	var html = input === '' ? text : text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
	return $.create("li", {
		innerHTML: html,
		"aria-selected": "false"
	});
};

_.REPLACE = function (text) {
	this.input.value = text.value;
};

_.DATA = function (item/*, input*/) { return item; };

// Private functions

function Suggestion(data) {
	var o = Array.isArray(data)
	  ? { label: data[0], value: data[1] }
	  : typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

	this.label = o.label || o.value;
	this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
	get: function() { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
	return "" + this.label;
};

function configure(instance, properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			instance[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			instance[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			instance[i] = null;
		}
		else {
			instance[i] = attrValue;
		}

		if (!instance[i] && instance[i] !== 0) {
			instance[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

$.siblingIndex = function (el) {
	/* eslint-disable no-cond-assign */
	for (var i = 0; el = el.previousElementSibling; i++);
	return i;
};

// Initialization

function init() {
	$$("input.awesomplete").forEach(function (input) {
		new _(input);
	});
}

// Are we in a browser? Check for Document constructor
if (typeof Document !== "undefined") {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== "undefined") {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof module === "object" && module.exports) {
	module.exports = _;
}

return _;

}());

},{}]},{},[1]);
