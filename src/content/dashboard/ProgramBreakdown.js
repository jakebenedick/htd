import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	useTheme,
	makeStyles,
} from '@material-ui/core';
//import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import axios from 'axios';

const useStyles = makeStyles(() => ({
	root: {},
}));

const ProgramBreakdown = ({ className, ...rest }) => {
	const classes = useStyles();
	const theme = useTheme();

	const [numHazardsArray, setNumHazardsArray] = React.useState([]);
	const [numSSSArray, setNumSSSArray] = React.useState([]);
	const [numSSDArray, setNumSSDArray] = React.useState([]);

	const getNumHazardsArray = () => {
		var i;
		const programs = ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM', 'EE'];

		for (i = 0; i < programs.length; i++) {
			axios
				.get(`http://localhost:4000/hazard/program/${programs[i]}`)
				.then((res) => {
					setNumHazardsArray([...numHazardsArray, res.data.length]);
				});
		}
	};

	const getNumSSSArray = () => {
		var i;
		const programs = ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM', 'EE'];

		for (i = 0; i < programs.length; i++) {
			axios
				.get(`http://localhost:4000/sss/program/${programs[i]}`)
				.then((res) => {
					setNumSSSArray([...numSSSArray, res.data.length]);
				});
		}
	};

	const getNumSSDArray = () => {
		var i;
		const programs = ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM', 'EE'];

		for (i = 0; i < programs.length; i++) {
			axios
				.get(`http://localhost:4000/ssd/program/${programs[i]}`)
				.then((res) => {
					setNumSSDArray([...numSSDArray, res.data.length]);
				});
		}
	};

	useEffect(() => {
		getNumHazardsArray();
		getNumSSSArray();
		getNumSSDArray();

		//eslint-disable-next-line
	}, []);

	const data = {
		datasets: [
			{
				backgroundColor: '#850F88',
				data: numHazardsArray,
				label: 'Hazards',
			},
			{
				backgroundColor: '#BDBEBC',
				data: numSSSArray,
				label: 'SSSs',
			},
			{
				backgroundColor: '#1F1646',
				data: numSSDArray,
				label: 'SSDs',
			},
		],
		labels: ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM', 'EE'],
	};

	const options = {
		animation: false,
		cornerRadius: 20,
		layout: { padding: 0 },
		legend: { display: true },
		maintainAspectRatio: false,
		responsive: true,
		/* scales: {
			xAxes: [
				{
					barThickness: 30,
					maxBarThickness: 50,
					barPercentage: 0.5,
					categoryPercentage: 0.5,
					ticks: {
						fontColor: theme.palette.text.secondary,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				},
			],
			yAxes: [
				{
					ticks: {
						fontColor: theme.palette.text.secondary,
						beginAtZero: true,
						min: 0,
					},
					gridLines: {
						borderDash: [2],
						borderDashOffset: [2],
						color: theme.palette.divider,
						drawBorder: false,
						zeroLineBorderDash: [2],
						zeroLineBorderDashOffset: [2],
						zeroLineColor: theme.palette.divider,
					},
				},
			],
		}, */
		tooltips: {
			backgroundColor: theme.palette.background.default,
			bodyFontColor: theme.palette.text.secondary,
			borderColor: theme.palette.divider,
			borderWidth: 1,
			enabled: true,
			footerFontColor: theme.palette.text.secondary,
			intersect: false,
			mode: 'index',
			titleFontColor: theme.palette.text.primary,
		},
	};

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardHeader
				/* action={
					<Button
						endIcon={<ArrowDropDownIcon />}
						size='small'
						variant='text'>
						Last 7 days
					</Button>
				} */
				title='Program Breakdown'
			/>
			<Divider />
			<CardContent>
				<Box height={400} position='relative'>
					<Bar data={data} options={options} />
				</Box>
			</CardContent>
			<Divider />
			<Box display='flex' justifyContent='flex-end' p={2}>
				<Button
					color='primary'
					endIcon={<ArrowRightIcon />}
					size='small'
					variant='text'>
					Overview
				</Button>
			</Box>
		</Card>
	);
};

ProgramBreakdown.propTypes = {
	className: PropTypes.string,
};

export default ProgramBreakdown;
