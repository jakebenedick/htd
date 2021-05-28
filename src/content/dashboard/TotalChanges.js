import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100%',
	},
	avatar: {
		backgroundColor: '#850F88',
		height: 56,
		width: 56,
	},
	differenceIcon: {
		color: '#850F88',
	},
	differenceValue: {
		color: 'black',
		marginRight: theme.spacing(1),
	},
	mainText: {
		fontSize: '1.65vw',
	},
}));

const TotalReports = ({ className, ...rest }) => {
	const classes = useStyles();
	const [numberOfReports, setNumberOfReports] = React.useState(0);
	const [lastMonth, setLastMonth] = React.useState(0);

	useEffect(() => {
		axios.get('http://localhost:4000/notification').then((res) => {
			//console.log(res.data);
			setNumberOfReports(res.data.length);
		});

		axios.get('http://localhost:4000/notification/month').then((res) => {
			setLastMonth(res.data.length);
		});
	}, []);

	return (
		<Link to='/Notifications' style={{ textDecoration: 'none' }}>
			<Card className={clsx(classes.root, className)} {...rest}>
				<CardContent>
					<Grid container justify='space-between' spacing={3}>
						<Grid item>
							<Typography
								color='textSecondary'
								gutterBottom
								variant='h5'
								className={classes.mainText}>
								CHANGES <br></br>TRACKED
							</Typography>
							<Typography color='textPrimary' variant='h3'>
								{numberOfReports}
							</Typography>
						</Grid>
						<Grid item>
							<Avatar className={classes.avatar}>
								<TrackChangesIcon />
							</Avatar>
						</Grid>
					</Grid>
					<Box mt={2} display='flex' alignItems='center'>
						{lastMonth >= 0 ? (
							<ArrowUpwardIcon
								className={classes.differenceIcon}
							/>
						) : (
							<ArrowDownwardIcon
								className={classes.differenceIcon}
							/>
						)}
						<Typography
							className={classes.differenceValue}
							variant='body2'>
							{lastMonth}
						</Typography>
						<Typography color='textSecondary' variant='caption'>
							Since last month
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</Link>
	);
};

TotalReports.propTypes = {
	className: PropTypes.string,
};

export default TotalReports;
