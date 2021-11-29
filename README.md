# baby-names
USA baby names exploration

## Running
`npm start`

## Notes
Uses [es7-sass-boilerplate](https://github.com/ericsoco/es7-sass-boilerplate) as a starting point.

## Updating
- Run `npm start` in [baby-name-scraper](https://github.com/ericsoco/baby-name-scraper) to generate a new CSV file, and copy to `static/data/all.csv`
- Update `static/data/birthCounts.csv` by manually extracting the `<table>` from [SSA](https://www.ssa.gov/oact/babynames/numberUSbirths.html) and grepping to reformat as needed in `birthCounts.csv`. Ensure separators are tabs.
