import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from "d3";
import Button from '@material-ui/core/Button';
const url = 'https://raw.githubusercontent.com/fivethirtyeight/data/master/bad-drivers/bad-drivers.csv';


const BarChart = ({ width }) => {

	const annotations = [
		{
			note: {
				title: "TOP 3 HIGHEST VALUE",
				label: "This state has one of the highest numbers"
			},
			x: 100,
			y: 100,
			dy: 100,
			dx: 100
		}
	]

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

	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: theme.spacing(1),
		},
		extendedIcon: {
			marginRight: theme.spacing(1),
		},
	}));

	const classes = useStyles();

	const [sort, setSort] = useState(false);

	data = sort
		? [...data].sort((a, b) => b['Number of drivers involved in fatal collisions per billion miles'] - a['Number of drivers involved in fatal collisions per billion miles'])
		: [...data];

	const barChartRef = useRef()

	const margin = ({ top: 30, right: 0, bottom: 30, left: 30 })

	const barHeight = 25;

	const height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom

	const maxVal = d3.max(data.map((d) => parseFloat(d['Number of drivers involved in fatal collisions per billion miles'])));

	const x = d3.scaleLinear()
		.domain([0, maxVal])
		.range([0, width])

	const y = d3.scaleBand()
		.domain(d3.range(data.length))
		.rangeRound([margin.top, height - margin.bottom])
		.padding(0.1)

	const xAxis = g => g
		.attr("transform", `translate(${120},${margin.bottom - 10})`)
		.call(d3.axisTop(x).ticks(6))
		.call(g => g.select(".domain").remove())

	const yAxis = g => g
		.attr("transform", `translate(${margin.left + 80},0)`)
		.call(d3.axisLeft(y).tickFormat(i => data[i].State).tickSizeOuter(0))

	const svg = d3.select(barChartRef.current)
		.attr("viewBox", [0, 0, width, height]);

	svg.append("g")
		.attr("fill", "steelblue")
		.selectAll("rect")
		.data(data)
		.join("rect")
		.attr("x", x(3))
		.attr("y", (d, i) => y(i))
		.attr("width", d => x(d['Number of drivers involved in fatal collisions per billion miles']) - x(0))
		.attr("height", y.bandwidth())
		.on("mouseover", function (d) {
			// d3.select("rect").style("fill", "blue");
		}).on("mouseout", function (d) {
			//  d3.select("rect").select("text").style("fill", "black");
		});

	// const makeAnnotations = d3.annotation()
	// 	.annotations(annotations)
	
	// d3.select("#example1")
	// 	.append("g")
	// 	.call(makeAnnotations)

	svg.append("g")
		.attr("fill", "white")
		.attr("text-anchor", "end")
		.attr("font-family", `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`)
		.attr("font-size", 16)
		.selectAll("text")
		.data(data)
		.join("text")
		.attr("x", d => x(d['Number of drivers involved in fatal collisions per billion miles']))
		.attr("y", (d, i) => y(i) + y.bandwidth() / 2)
		.attr("dy", "0.35em")
		.attr("dx", -4)
		.text(d => d['Number of drivers involved in fatal collisions per billion miles'])
		.call(text => text.filter(d => x(d['Number of drivers involved in fatal collisions per billion miles']) - x(0) < 20) // short bars
			.attr("dx", +4)
			.attr("fill", "black")
			.attr("text-anchor", "start"));

	svg.append("g")
		.call(xAxis);

	svg.append("g")
		.call(yAxis);

	return (
		<div>
			{/* <Button
			 	variant="contained"
				color="primary"
				size="small"
				className={classes.margin}
				onClick={() => {
					setSort(!sort);
				}}
				style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

				Sort values
			</Button> */}
			<svg ref={barChartRef}></svg>
		</div>
	);
}

export default BarChart;