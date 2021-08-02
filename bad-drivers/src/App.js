import './App.css';
import Introduction from './Introduction/Introduction';
import BubbleChart from './BubbleChart/BubbleChart';
import BarChart from './BarChart/BarChart';
import Bar from './BarChart/BarChart';
import Paginator from './Paginator/Paginator';
import { useEffect, useState,  } from 'react';
import usePagination from "./Paginator/hooks/usePagination";
import * as d3 from 'd3';

function App() {

	const ITEMS_PER_PAGE = 1;

	const [data, setData] = useState([]);
	const [error, setError] = useState();
	const {currentPage, setCurrentPage} = usePagination(data, ITEMS_PER_PAGE);


	const pageMap = {
		1: (
			<div className="num-drivers-collision-per-billion-miles">
				<h1 style={{margin:20, textAlign: 'center'}} className="label-1">🚘 Number of drivers involved in fatal collisions per billion miles </h1>
					<Bar
						width={900}
					/>
			</div>
		),
		2: (
			<div className="percent-drivers-speeding-colision">
				<h1 style={{margin:20, marginTop: 30, textAlign: 'center'}} className="label-2">🚓 Percentage of fatal collisions caused by <span style={{'textDecoration': 'underline'}}>speeding</span> drivers</h1>
					<BubbleChart
						width={970}
					/>
			</div>
		),
		3: (
			<div className="percent-drivers-speeding-colision">
			<h1 style={{margin:20, textAlign: 'center'}} className="label-2">💸<span style={{'textDecoration': 'underline'}}></span> Average combined insurance premium</h1>
				
		</div>
		)
	}

	const onPageChange = (event, value) => setCurrentPage(value);

	return (
		<div>
			<Introduction />
			<Paginator
				onPageChange={onPageChange}
				currentPage={currentPage}
				pageCount={3}
			/>
			{/* <div className="num-drivers-collision-per-billion-miles">
				<h2 style={{margin:20, textAlign: 'center'}} className="label-1">🚘 Number of drivers involved in fatal collisions per billion miles </h2>
				<Bar
					data={data}
					width={900}
				/>
			</div> */}
			{/* <div className="percent-drivers-speeding-colision">
				<h2 style={{margin:20, textAlign: 'center'}} className="label-2">🚓 Percentage of fatal collisions caused by <span style={{'textDecoration': 'underline'}}>speeding</span> drivers</h2>
				<BubbleChart
					data={data}
					width={970}
				/>
			</div> */}
			{pageMap[currentPage]}

		</div>
	);
}

export default App;