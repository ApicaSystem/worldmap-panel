## Apica Worldmap Panel Plugin for Grafana

Apica Worldmap Panel Plugin supports geo coordinates data provided by Apica Synthetic Monitoring datasource.

Based on [Grafana Worldmap Panel plugin](https://github.com/grafana/worldmap-panel) v0.0.18.

The original readme file can be found here: [README.md](https://github.com/grafana/worldmap-panel/blob/master/README.md).

### Changelog

#### v0.0.1

Based on [Grafana Worldmap Panel plugin](https://github.com/grafana/worldmap-panel) v0.0.18.

The only format from datasource is supported: table.

Required the following 'columns' in table:

  * geohash - encoded latitude and longitude;
  * metric - takes a color code: 0 for gray, 1 for green, 2 for yellow, 3 for orange and 4 for red;
  * a column with popup label text that will be shown on mouse over the point on the map, optional, if nothing then n/a will be shown as a popup label.

Editor tab is simplified. The following settings can be found here:

1. Map Visual Options:
	* Center - for centering the map
	* Initial Zoom
	* Min Circle Size - no different sizes are allowed, so this field sets all circles size
	* Sticky Labels - if checked then popup labels will not disappear automatically

2. Map Data Options:
	* Table Label Field - table column that should be used as popup label text. Predefined with 'summaryHtml' value, which is the column name that contains Apica Syntetic Monitoring location checks summary. 

#### v0.0.2

Upgraded from [Grafana Worldmap Panel plugin](https://github.com/grafana/worldmap-panel) v0.0.21

#### v0.1.0

Minor bugfixes. Version is 0.1.0 now.
