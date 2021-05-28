import React from 'react';
import PropTypes from 'prop-types';
import AxiosHooks from 'axios-hooks';
//import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import HazardTable from '../tables/Hazard Table';
import SSDTable from '../tables/SSD Table';
import SSSTable from '../tables/SSS Table';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const drawerWidth = 256;

const styles = (theme) => ({
	paper: {
		margin: 'auto',
		overflow: 'hidden',
	},
	searchBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	},
	contentWrapper: {
		margin: '20px 16px',
	},
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	app: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
		flex: 1,
		padding: theme.spacing(6, 4),
		background: '#eaeff1',
	},
	footer: {
		padding: theme.spacing(2),
		background: '#eaeff1',
	},
});

function HazardSearch(props) {
	const { classes, selectedTab } = props;
	const [searchField, setSearchField] = React.useState('');
	const [count, setCount] = React.useState(0);
	// eslint-disable-next-line
	const [slashOne, setSlashOne] = React.useState('/');
	// eslint-disable-next-line
	const [slashTwo, setSlashTwo] = React.useState('/');
	const hazardSearchOptions = [
		'ID',
		'Description',
		'Likelihood',
		'Risk',
		'Severity',
		'Supporting Document',
		/* 'SSS List', */
		'Program',
	];
	const sssSearchOptions = [
		'ID',
		'Requirement Text',
		'Status',
		'Mapped SSD',
		'Program',
	];

	const ssdSearchOptions = [
		'ID',
		'Requirement Text',
		'Status',
		'Safety Control List',
		'Mapped SSS',
		'Program',
	];

	const handleChange = (event) => {
		setSearchField(event.target.value);
	};

	const tabSelected = (selectedTab) => {
		if (typeof selectedTab !== 'undefined' && selectedTab != null) {
			return selectedTab;
		} else return 'Hazard';
	};

	const searchBy = (type, count) => {
		switch (type) {
			case 'Hazard':
				return hazardSearchOptions[count % hazardSearchOptions.length];
			case 'SSS':
				return sssSearchOptions[count % sssSearchOptions.length];
			case 'SSD':
				return ssdSearchOptions[count % ssdSearchOptions.length];
			default:
				return hazardSearchOptions[count % hazardSearchOptions.length];
		}
	};

	const selectHeaderLabels = (type) => {
		switch (type) {
			case 'Hazard':
				return hazardSearchOptions;
			case 'SSS':
				return sssSearchOptions;
			case 'SSD':
				return ssdSearchOptions;
			default:
				return hazardSearchOptions;
		}
	};

	const selectedTabSearchText = (selectedTab, count) => {
		var tab;

		if (typeof selectedTab !== 'undefined' && selectedTab != null) {
			tab = selectedTab;
		} else tab = 'Hazard';

		switch (tab) {
			case 'Hazard':
				return 'Search by Hazard ' + searchBy('Hazard', count);
			case 'SSS':
				return 'Search by SSS ' + searchBy('SSS', count);
			case 'SSD':
				return 'Search by SSD ' + searchBy('SSD', count);
			default:
				return 'Search By Hazard ID, Description, Likelihood, Severity, Risk, or Supporting Document';
		}
	};

	const typeOfTable = (selectedTab) => {
		switch (selectedTab) {
			case 'Hazard':
				return (
					<HazardTable
						data={data}
						searchCriteria={searchField}
						//parentCallback={handleRefetch}
						headerArray={selectHeaderLabels(
							tabSelected(selectedTab)
						)}></HazardTable>
				);
			case 'SSD':
				return (
					<SSDTable
						data={data}
						headerArray={selectHeaderLabels(
							tabSelected(selectedTab)
						)}></SSDTable>
				);
			case 'SSS':
				return (
					<SSSTable
						data={data}
						headerArray={selectHeaderLabels(
							tabSelected(selectedTab)
						)}></SSSTable>
				);
			default:
				return (
					<HazardTable
						data={data}
						searchCriteria={searchField}
						category={searchBy('Hazard', count)}
						headerArray={selectHeaderLabels(
							tabSelected(selectedTab)
						)}></HazardTable>
				);
		}
	};

	const [{ data, loading, error }] = AxiosHooks(
		`http://localhost:4000/${tabSelected(selectedTab)}${slashOne}${searchBy(
			tabSelected(selectedTab),
			count
		).replaceAll(' ', '_')}${slashTwo}${searchField}`
	);

	return (
		<Paper className={classes.paper} elevation={3}>
			<AppBar
				className={classes.searchBar}
				position='static'
				color='default'
				elevation={0}>
				<Toolbar>
					<Grid container spacing={2} alignItems='center'>
						<Grid item>
							<IconButton aria-label='search'>
								<SearchIcon
									className={classes.block}
									//onClick={handleSearchButtonClicked}
									color='inherit'
								/>
							</IconButton>
						</Grid>
						<Grid item xs>
							<TextField
								fullWidth
								placeholder={selectedTabSearchText(
									selectedTab,
									count
								)}
								InputProps={{
									disableUnderline: true,
									className: classes.searchInput,
								}}
								value={searchField}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item>
							<Tooltip
								title='Previous Search Criteria'
								aria-label='Previous'>
								<IconButton
									aria-label='back'
									onClick={() => setCount(count + 209)}>
									<ChevronLeftIcon
										className={classes.block}
										color='inherit'
									/>
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item>
							<Tooltip
								title='Next Search Criteria'
								aria-label='Next'>
								<IconButton
									aria-label='forward'
									onClick={() => setCount(count + 1)}>
									<ChevronRightIcon
										className={classes.block}
										color='inherit'
									/>
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<div className={classes.contentWrapper}>
				{loading ? (
					<Typography
						color='textSecondary'
						align='center'
						style={{
							display: 'none',
						}}>
						Loading...
					</Typography>
				) : (
					''
				)}
				{error ? (
					<Typography
						color='textSecondary'
						align='center'
						style={{
							display: 'none',
						}}>
						An error has occurred.
					</Typography>
				) : (
					''
				)}
				{data ? (
					typeOfTable(selectedTab)
				) : (
					<Typography color='textSecondary' align='center'>
						Search results will be displayed here.
					</Typography>
				)}
			</div>
		</Paper>
	);
}

HazardSearch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HazardSearch);
