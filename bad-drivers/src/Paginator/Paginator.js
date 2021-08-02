import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			marginTop: theme.spacing(2),
		},
	},
	pagination: {
		display: 'flex',
		justifyContent: 'center',
	  },
}));

export default function Paginator({pageCount, onPageChange, currentPage}) {

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Pagination
			 	className={classes.pagination}
				count={pageCount}
				size="large"
				onChange={onPageChange}
				color="secondary"
				variant="outlined"
			/>
		</div>

	);
}