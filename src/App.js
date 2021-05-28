import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import {
	createMuiTheme,
	ThemeProvider,
	withStyles,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import LinkDisplay from '@material-ui/core/Link';
import Navigator from './layout/Navigator';
import HazardSearch from './content/pages/Data Search';
import DataEntry from './content/pages/Data Entry';
import Mapping from './content/pages/Data Mapping';
import ReportGeneration from './content/reports/Report Generation';
import Header from './layout/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './content/authentication/PrivateRoute';
import UserPage from './content/pages/Users';
import AboutPage from './content/pages/About';
import UploadPage from './content/pages/Upload';
import DataEdit from './content/pages/Data Edit';
import HomePage from './content/dashboard/Dashboard';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import RegisterPage from './content/authentication/Register';
import LoginPage from './content/authentication/Login';
import ContactPage from './content/pages/Contact';
//import useToken from './content/authentication/UseToken';
import { Provider } from 'react-redux';
import store from './store';
import NotificationsPage from './content/notifications/Notifications';
import AccountPage from './content/authentication/Account';

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<LinkDisplay color='inherit' href='https://www.leidos.com/'>
				Leidos
			</LinkDisplay>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

let theme = createMuiTheme({
	palette: {
		primary: {
			light: '#63ccff',
			main: '#850F88',
			dark: '#006db3',
		},
	},
	typography: {
		h5: {
			fontWeight: 500,
			fontSize: 26,
			letterSpacing: 0.5,
		},
	},
	shape: {
		borderRadius: 8,
	},
	props: {
		MuiTab: {
			disableRipple: true,
		},
	},
	mixins: {
		toolbar: {
			minHeight: 48,
		},
	},
});

theme = {
	...theme,
	overrides: {
		MuiDrawer: {
			paper: {
				backgroundColor: '#18202c',
			},
		},
		MuiButton: {
			label: {
				textTransform: 'none',
			},
			contained: {
				boxShadow: 'none',
				'&:active': {
					boxShadow: 'none',
				},
			},
		},
		MuiTabs: {
			root: {
				marginLeft: theme.spacing(1),
			},
			indicator: {
				height: 3,
				borderTopLeftRadius: 3,
				borderTopRightRadius: 3,
				backgroundColor: theme.palette.common.white,
			},
		},
		MuiTab: {
			root: {
				textTransform: 'none',
				margin: '0 16px',
				minWidth: 0,
				padding: 0,
				[theme.breakpoints.up('md')]: {
					padding: 0,
					minWidth: 0,
				},
			},
		},
		MuiIconButton: {
			root: {
				padding: theme.spacing(1),
			},
		},
		MuiTooltip: {
			tooltip: {
				borderRadius: 4,
			},
		},
		MuiDivider: {
			root: {
				backgroundColor: '#404854',
			},
		},
		MuiListItemText: {
			primary: {
				fontWeight: theme.typography.fontWeightMedium,
			},
		},
		MuiListItemIcon: {
			root: {
				color: 'inherit',
				marginRight: 0,
				'& svg': {
					fontSize: 20,
				},
			},
		},
		MuiAvatar: {
			root: {
				width: 32,
				height: 32,
			},
		},
	},
};

const drawerWidth = 256;

const styles = {
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
};

const App = (props) => {
	const { classes } = props;
	var selectedTab;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	//Handles the toggle of the navbar on Mobile devices
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	// Check for token to keep user logged in
	if (localStorage.jwtToken) {
		// Set auth token header auth
		const token = localStorage.jwtToken;
		setAuthToken(token);
		// Decode token and get user info and exp
		const decoded = jwt_decode(token);
		// Set user and isAuthenticated
		store.dispatch(setCurrentUser(decoded));
		// Check for expired token
		const currentTime = Date.now() / 1000; // to get in milliseconds
		if (decoded.exp < currentTime) {
			// Logout user
			store.dispatch(logoutUser());
			// Redirect to login
			window.location.href = './login';
		}
	}

	return (
		//Provider wrapper gives access to Redux state to all components
		<Provider store={store}>
			<Router>
				<ThemeProvider theme={theme}>
					<HelmetProvider>
						<div className='App'>
							<div className={classes.root}>
								<CssBaseline />
								<nav className={classes.drawer}>
									<Hidden smUp implementation='js'>
										<Navigator
											PaperProps={{
												style: { width: drawerWidth },
											}}
											variant='temporary'
											open={mobileOpen}
											onClose={handleDrawerToggle}
										/>
									</Hidden>
									<Hidden xsDown implementation='css'>
										<Navigator
											PaperProps={{
												style: { width: drawerWidth },
											}}
										/>
									</Hidden>
								</nav>
								<div className={classes.app}>
									<Switch>
										<PrivateRoute
											path='/'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={'Dashboard'}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Home
															</title>
														</Helmet>
														<HomePage></HomePage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Account'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Account Info'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Account
																Info
															</title>
														</Helmet>
														<AccountPage></AccountPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Search'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Search'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Search',
															},
															{
																label: 'SSS',
																link:
																	'/Search/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Search/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Search
															</title>
														</Helmet>
														<HazardSearch
															selectedTab={
																'Hazard'
															}></HazardSearch>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Search/SSS'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Search'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Search',
															},
															{
																label: 'SSS',
																link:
																	'/Search/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Search/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Search
															</title>
														</Helmet>
														<HazardSearch
															selectedTab={
																'SSS'
															}></HazardSearch>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Search/SSD'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Search'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Search',
															},
															{
																label: 'SSS',
																link:
																	'/Search/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Search/SSD',
															},
														]}
														tabInitialValue={2}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Search
															</title>
														</Helmet>
														<HazardSearch
															selectedTab={
																'SSD'
															}></HazardSearch>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															programSelected={
																'ABRR'
															}
															type={
																'SSS'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSS/:program'
											exact
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															programSelected={
																props.match
																	.params
																	.program
															}
															type={
																'SSS'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSD/:program'
											exact
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															programSelected={
																props.match
																	.params
																	.program
															}
															type={
																'SSD'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSS'
											exact
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															programSelected={
																'ABRR'
															}
															type={
																'SSS'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSD'
											exact
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															programSelected={
																'ABRR'
															}
															type={
																'SSD'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSS/:program/:requirement'
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															requirementParam={
																props.match
																	.params
																	.requirement
															}
															programSelected={
																props.match
																	.params
																	.program
															}
															type={
																'SSS'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Mapping/SSD/:program/:requirement'
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Data Mapping'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'SSS',
																link:
																	'/Mapping/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Mapping/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Mapping
															</title>
														</Helmet>
														<Mapping
															requirementParam={
																props.match
																	.params
																	.requirement
															}
															programSelected={
																props.match
																	.params
																	.program
															}
															type={
																'SSD'
															}></Mapping>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Entry'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Entry'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Entry',
															},
															{
																label: 'SSS',
																link:
																	'/Entry/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Entry/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Entry
															</title>
														</Helmet>
														<DataEntry
															selectedTab={
																'Hazard'
															}
															secondarySelectedTab='ABRR'
															tabs={[
																'ABRR',
																'ADSB',
																'DATACOM',
																'GIMS',
																'SWIM',
																'EE',
															]}></DataEntry>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Entry/SSS'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Entry'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Entry',
															},
															{
																label: 'SSS',
																link:
																	'/Entry/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Entry/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Entry
															</title>
														</Helmet>
														<DataEntry
															selectedTab={'SSS'}
															secondarySelectedTab='ABRR'
															tabs={[
																'ABRR',
																'ADSB',
																'DATACOM',
																'GIMS',
																'SWIM',
																'EE',
															]}></DataEntry>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Entry/SSD'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Entry'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Entry',
															},
															{
																label: 'SSS',
																link:
																	'/Entry/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Entry/SSD',
															},
														]}
														tabInitialValue={2}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Entry
															</title>
														</Helmet>
														<DataEntry
															selectedTab={'SSD'}
															secondarySelectedTab='ABRR'
															tabs={[
																'ABRR',
																'ADSB',
																'DATACOM',
																'GIMS',
																'SWIM',
																'EE',
															]}></DataEntry>
													</main>
												</Fragment>
											)}
										/>

										<PrivateRoute
											path='/edit/hazard/:id'
											component={(props) => (
												<Fragment>
													<Header
														headerText={
															'Hazard Edit'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Edit
															</title>
														</Helmet>
														<DataEdit
															hazard_id={
																props.match
																	.params.id
															}
															secondaryTabSelected='Hazard Edit'
															selectedTab={
																selectedTab
															}
															tabs={[
																'Hazard Edit',
															]}></DataEdit>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/edit/sss/:id'
											component={(props) => (
												<Fragment>
													<Header
														headerText={'SSS Edit'}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Edit
															</title>
														</Helmet>
														<DataEdit
															sss_id={
																props.match
																	.params.id
															}
															secondaryTabSelected='SSS Edit'
															selectedTab={
																selectedTab
															}
															tabs={[
																'SSS Edit',
															]}></DataEdit>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/edit/ssd/:id'
											component={(props) => (
												<Fragment>
													<Header
														headerText={'SSD Edit'}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Edit
															</title>
														</Helmet>
														<DataEdit
															ssd_id={
																props.match
																	.params.id
															}
															secondaryTabSelected='SSD Edit'
															selectedTab={
																selectedTab
															}
															tabs={[
																'SSD Edit',
															]}></DataEdit>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Reporting'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Report Generation'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link:
																	'/Reporting',
															},
															{
																label: 'SSS',
																link:
																	'/Reporting/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Reporting/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Reporting
															</title>
														</Helmet>
														<ReportGeneration
															selectedTab={
																'Hazard'
															}></ReportGeneration>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Reporting/SSS'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Report Generation'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link:
																	'/Reporting',
															},
															{
																label: 'SSS',
																link:
																	'/Reporting/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Reporting/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Reporting
															</title>
														</Helmet>
														<ReportGeneration
															selectedTab={
																'SSS'
															}></ReportGeneration>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Reporting/SSD'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Report Generation'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link:
																	'/Reporting',
															},
															{
																label: 'SSS',
																link:
																	'/Reporting/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Reporting/SSD',
															},
														]}
														tabInitialValue={2}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Reporting
															</title>
														</Helmet>
														<ReportGeneration
															selectedTab={
																'SSD'
															}></ReportGeneration>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Upload'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Upload'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Upload',
															},
															{
																label: 'SSS',
																link:
																	'/Upload/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Upload/SSD',
															},
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Upload
															</title>
														</Helmet>
														<UploadPage
															dataType={
																'Hazard'
															}></UploadPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Upload/SSS'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Upload'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Upload',
															},
															{
																label: 'SSS',
																link:
																	'/Upload/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Upload/SSD',
															},
														]}
														tabInitialValue={1}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Upload
															</title>
														</Helmet>
														<UploadPage
															dataType={
																'SSS'
															}></UploadPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Upload/SSD'
											exact
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Data Upload'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															{
																label: 'Hazard',
																link: '/Upload',
															},
															{
																label: 'SSS',
																link:
																	'/Upload/SSS',
															},
															{
																label: 'SSD',
																link:
																	'/Upload/SSD',
															},
														]}
														tabInitialValue={2}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Upload
															</title>
														</Helmet>
														<UploadPage
															dataType={
																'SSD'
															}></UploadPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Users'
											component={() => (
												<Fragment>
													<Header
														headerText={
															'Users Page'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															'Hazard',
															'SSS',
															'SSD',
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Users
															</title>
														</Helmet>
														<UserPage></UserPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/About'
											component={() => (
												<Fragment>
													<Header
														headerText={
															'About Page'
														}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[
															'Hazard',
															'SSS',
															'SSD',
														]}
														tabInitialValue={0}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: About
															</title>
														</Helmet>
														<AboutPage></AboutPage>
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Contact'
											component={() => (
												<Fragment>
													<Header
														headerText={'Contact'}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App: Contact
															</title>
														</Helmet>
														<ContactPage />
													</main>
												</Fragment>
											)}
										/>
										<PrivateRoute
											path='/Notifications'
											component={() => (
												<Fragment>
													<Header
														headerText={'Changelog'}
														onDrawerToggle={
															handleDrawerToggle
														}
														tabs={[]}
													/>
													<main
														className={
															classes.main
														}>
														<Helmet>
															<title>
																Hazard Tracking
																App:
																Notifications
															</title>
														</Helmet>
														<NotificationsPage />
													</main>
												</Fragment>
											)}
										/>
									</Switch>
									<Route
										path='/Register'
										render={() => (
											<Fragment>
												<main className={classes.main}>
													<Helmet>
														<title>
															Hazard Tracking App:
															Sign Up
														</title>
													</Helmet>
													<RegisterPage></RegisterPage>
												</main>
											</Fragment>
										)}
									/>
									<Route
										path='/Login'
										render={() => (
											<Fragment>
												<main className={classes.main}>
													<Helmet>
														<title>
															Hazard Tracking App:
															Login
														</title>
													</Helmet>
													<LoginPage></LoginPage>
												</main>
											</Fragment>
										)}
									/>
									<footer className={classes.footer}>
										<Copyright />
									</footer>
								</div>
							</div>
						</div>
					</HelmetProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	);
};

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
