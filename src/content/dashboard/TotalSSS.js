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
import FlightLandIcon from '@material-ui/icons/FlightLand';
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

const TotalSSS = ({ className, ...rest }) => {
	const classes = useStyles();
	const [numberOfSSS, setNumberOfSSS] = React.useState(0);
	const [lastMonth, setLastMonth] = React.useState(0);

	useEffect(() => {
		axios.get('http://localhost:4000/sss').then((res) => {
			setNumberOfSSS(res.data.length);
		});

		axios.get('http://localhost:4000/notification/month').then((res) => {
			var count = 0;

			for (let i = 0; i < res.data.length; i++) {
				//console.log(res.data[i].header);
				if (res.data[i].header.includes('SSS Added')) {
					count++;
					//console.log(count);
				} else if (res.data[i].header.includes('SSS Deleted')) {
					count--;
				}
			}

			//console.log(count);
			setLastMonth(count);
		});
	}, []);

	return (
		<Link to='/Search/SSS' style={{ textDecoration: 'none' }}>
			<Card className={clsx(classes.root, className)} {...rest}>
				<CardContent>
					<Grid container justify='space-between' spacing={3}>
						<Grid item>
							<Typography
								color='textSecondary'
								gutterBottom
								variant='h5'
								className={classes.mainText}>
								SSSs <br></br> STORED
							</Typography>
							<Typography color='textPrimary' variant='h3'>
								{numberOfSSS}
							</Typography>
						</Grid>
						<Grid item>
							<Avatar className={classes.avatar}>
								<FlightLandIcon />
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

TotalSSS.propTypes = {
	className: PropTypes.string,
};

export default TotalSSS;
