import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from "d3";
import Button from '@material-ui/core/Button';
const url = 'https://raw.githubusercontent.com/fivethirtyeight/data/master/bad-drivers/bad-drivers.csv';

const BarChart = ({ width }) => {

	let [data, setData] = useState([]);

	useEffect(() => {
		try {
			(async () => {
				let response = await d3.csv(url)

				await setData(response);
			})();

		} catch (error) {
			console.error(error);
		}

	}, []);

	// add group value to each data entry for colors
	const groupedData = data && data.map((entry) => {
		const numTotalAccidents = parseFloat(entry['Number of drivers involved in fatal collisions per billion miles']);
		const speedingAccidentPercent = parseFloat(entry['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding']) / 100;
		const numSpeedingAccidents = numTotalAccidents * speedingAccidentPercent;

		if (numSpeedingAccidents > 0) {
			if (numSpeedingAccidents < 3.3) {
				entry.group = 1;
			}
			else if (numSpeedingAccidents < 6.6) {
				entry.group = 2;
			}
			else if (numSpeedingAccidents < 10) {
				entry.group = 3;
			}
			else {
				entry.group = 4;
			}
		}
		else {
			entry.group = 0;
		}
		return entry;
	});

	const color = d3.scaleOrdinal(groupedData.map(d => d.group), d3.schemeCategory10);

	const bubbleChartRef = useRef();

	const diameter = 970;

	// create an object with key=children
	// IMPORTANT: values here are sorted so that the chart is displayed correctly with large bubble values in the middle
	const nodeData = {
		children: [...groupedData].sort((a, b) => b['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding'] - a['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding'])
	}

	const bubble = d3.pack(groupedData)
		.size([diameter, diameter])
		.padding(1.1);

	const heigth = width;

	const svg = d3.select(bubbleChartRef.current)
		.append("svg")
		.attr("width", width)
		.attr("height", heigth)
		.attr("class", "bubble");

	const nodes = d3.hierarchy(nodeData)
		.sum((d)=>  { return d['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding']; });

	const node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter((d) => {
			return !d.children
		})
		.append("g")
		.attr("class", "node")
		.attr("transform", (d) => {
			return "translate(" + d.x + "," + d.y + ")";
		});

	node.append("title")
		.text((d, i) => {
			return d.data && d.data.State + ": " + d.data['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding'];
		});
	
	const tooltip = d3.select('#bubble-chart-area')
		.append('div')
		.style('visibility', 'hidden')
		.style('position', 'absolute')
		.style('background-color', 'red')

	node.append("circle")
		.attr("r", (d) => {
			return d.r;
		})
		.style("fill", (d, i) => {
			return color(i);
		})
		.on('mouseover', (e, d) => {
			tooltip.style('visibility', 'visible')
				.text('heck yeah')
		});

	node.append("text")
		.attr("dy", ".2em")
		.style("text-anchor", "middle")
		.text((d) => {
			if (d.data && d.data.State === 'District of Columbia'){
				d.data.State = 'D.C.'
			}
			return d.data && d.data.State.substring(0, d.r / 3);
		})
		.attr("font-family", `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`)
		.attr("font-size", (d) => {
			return d.r / 4;
		})
		.attr('font-weight', 'bold')
		.attr("fill", "white");

	node.append("text")
		.attr("dy", "1.3em")
		.style("text-anchor", "middle")
		.text((d) => {
			return `${d.data['Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding']}%`;
		})
		.attr("font-family", `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`)
		.attr("font-size", (d) => {
			return d.r / 4;
		})
		.attr('font-weight', 'bold')
		.attr("fill", "white");

	d3.select(window.frameElement)
		.style("height", diameter + "px");

	return (
		<div id="bubble-chart-area">
			<svg width={970} height={970} ref={bubbleChartRef}></svg>
		</div>
	);
}

export default BarChart;