import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../layout/Page';
//import Budget from './Budget';
//import LatestOrders from './LatestOrders';
//import LatestProducts from './LatestProducts';
import Sales from './ProgramBreakdown';
import TotalSSD from './TotalSSD';
import TotalCustomers from './TotalHazards';
import TotalSSS from './TotalSSS';
import TrafficByDevice from './EditsByUser';
import TotalReports from './TotalChanges';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const Dashboard = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title='Dashboard'>
			<Container maxWidth={false}>
				<Grid container spacing={3}>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalCustomers />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalSSS />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalSSD />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalReports />
					</Grid>
					<Grid item lg={8} md={12} xl={9} xs={12}>
						<Sales />
					</Grid>
					<Grid item lg={4} md={6} xl={3} xs={12}>
						<TrafficByDevice />
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default Dashboard;
