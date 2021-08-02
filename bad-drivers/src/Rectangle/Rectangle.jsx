import React from "react";
import * as d3 from "d3";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");

export const Rect = ({ data, x, y, height, top, bottom }) => {
	return (
		<g transform={`translate(${x(data.date)}, ${y(data.value)})`}>
			<rect
				width={x.bandwidth()}
				height={height - bottom - top - y(data.value)}
				fill={colors(data.index)}
			/>
			<text
				transform={`translate(${x.bandwidth() / 2}, ${-2})`}
				textAnchor="middle"
				alignmentBaseline="baseline"
				fill="grey"
				fontSize="10"
			>
				{format(data.value)}
			</text>
		</g>
	);
};