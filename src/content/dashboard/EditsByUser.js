import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Button,
	colors,
	makeStyles,
	useTheme,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import 'chartjs-plugin-colorschemes';

const useStyles = makeStyles(() => ({
	root: {
		height: '100%',
	},
}));

const TrafficByDevice = ({ className, ...rest }) => {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [users, setUsers] = React.useState(new Set());
	const [dataTwo, setDataTwo] = React.useState([]);

	const data = {
		datasets: [
			{
				data: dataTwo,
				borderWidth: 8,
				borderColor: colors.common.white,
				hoverBorderColor: colors.common.white,
			},
		],
		labels: Array.from(users),
	};

	const options = {
		animation: false,
		cutoutPercentage: 80,
		layout: { padding: 0 },
		legend: {
			display: true,
			position: 'bottom',
		},
		maintainAspectRatio: false,
		responsive: true,
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
		plugins: {
			colorschemes: {
				scheme: 'brewer.PRGn6',
			},
		},
	};

	useEffect(() => {
		axios.get('http://localhost:4000/notification').then((res) => {
			const userSet = new Set();

			for (let i = 0; i < res.data.length; i++) {
				userSet.add(res.data[i].userFrom);
				//setUsers((prev) => new Set(prev.add(res.data[i].userFrom)));
			}
			setUsers(userSet);
			//console.log(userSet);
			const usersArray = Array.from(userSet);

			for (let i = 0; i < usersArray.length; i++) {
				console.log(usersArray[i]);
				axios
					.get(
						`http://localhost:4000/notification/from/${usersArray[i]}`
					)
					.then((res2) => {
						setDataTwo([...dataTwo, res2.data.length]);
						console.log(res2.data.length);
					});
			}
		});

		//eslint-disable-next-line
	}, []);

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardHeader title='Changes by User' />
			<Divider />
			<CardContent>
				<Box height={400} position='relative'>
					<Doughnut data={data} options={options} />
				</Box>
			</CardContent>
			<Divider />
			<Box display='flex' justifyContent='flex-end' p={2}>
				<Button
					onClick={() => history.push('/Notifications')}
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

TrafficByDevice.propTypes = {
	className: PropTypes.string,
};

export default TrafficByDevice;
