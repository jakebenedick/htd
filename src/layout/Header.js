import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import AccountDropdown from './AccountDropdown';
import NotificationsDropdown from '../content/notifications/NotificationsDropdown';
import { connect } from 'react-redux';
import axios from 'axios';
import OnlineBadge from './OnlineBadge';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
	secondaryBar: {
		zIndex: 0,
	},
	menuButton: {
		marginLeft: -theme.spacing(1),
	},
	iconButtonAvatar: {
		padding: 5,
	},
	link: {
		textDecoration: 'none',
		color: lightColor,
		'&:hover': {
			color: theme.palette.common.white,
		},
	},
	button: {
		borderColor: lightColor,
	},
});

function Header(props) {
	const {
		classes,
		onDrawerToggle,
		tabs,
		headerText,
		tabInitialValue,
	} = props;
	const { user } = props.auth;
	var names = user.name.split(' ');
	var initials = names[0].charAt(0) + '' + names[1].charAt(0);
	const [value, setValue] = React.useState(tabInitialValue);
	const [showAvatar, setShowAvatar] = React.useState(false);
	const [showNotifications, setShowNotifications] = React.useState(false);
	const [numUnreadNotifications, setNumUnreadNotifications] = React.useState(
		0
	);

	useEffect(() => {
		axios
			.get(`http://localhost:4000/notification/user/${user.name}`)
			.then((res) => {
				//console.log(res.data);

				let unreadCount = 0;

				for (let i = 0; i < res.data.length; i++) {
					if (!res.data[i].read.includes(user.name)) {
						unreadCount++;
					}
				}
				setNumUnreadNotifications(unreadCount);
			});
	}, [user.name]);

	const handleChange = (event, newValue) => {
		setValue(newValue);

		//parentCallback(tabs[newValue]);
	};

	const contactLinkClicked = () => {
		window.location.href = '/Contact';
	};

	const handleAvatarClicked = () => {
		setShowAvatar(!showAvatar);
		setShowNotifications(false);
	};

	const handleNotificationsClicked = () => {
		setShowNotifications(!showNotifications);
		setShowAvatar(false);
	};

	return (
		<Fragment>
			<AppBar color='primary' position='sticky' elevation={0}>
				<Toolbar>
					<Grid container spacing={1} alignItems='center'>
						<Hidden smUp>
							<Grid item>
								<IconButton
									color='inherit'
									aria-label='open drawer'
									onClick={onDrawerToggle}
									className={classes.menuButton}>
									<MenuIcon />
								</IconButton>
							</Grid>
						</Hidden>
						<Grid item xs />
						<Grid item>
							<Tooltip title='Notifications'>
								<IconButton
									color='inherit'
									onClick={handleNotificationsClicked}>
									<Badge
										color='secondary'
										badgeContent={numUnreadNotifications}>
										<NotificationsIcon />
									</Badge>
								</IconButton>
							</Tooltip>
							{showNotifications && <NotificationsDropdown />}
						</Grid>
						<Grid item>
							<IconButton
								onClick={handleAvatarClicked}
								className={classes.iconButtonAvatar}
								color='inherit'>
								<OnlineBadge
									online={true}
									size='small'
									content={
										<Avatar
											style={{
												backgroundColor: '#1F1646',
											}}>
											{initials}
										</Avatar>
									}></OnlineBadge>
							</IconButton>
							{showAvatar && (
								<AccountDropdown
									style={{
										minWidth: 275,
										position: 'fixed',
										top: '50px',
										right: '25px',
										textAlign: 'center',
									}}
									avatar={
										<Avatar
											style={{
												width: '75px',
												height: '75px',
												margin: 'auto',
												backgroundColor: '#1F1646',
											}}>
											{initials}
										</Avatar>
									}
								/>
							)}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<AppBar
				component='div'
				className={classes.secondaryBar}
				color='primary'
				position='static'
				elevation={0}>
				<Toolbar>
					<Grid container alignItems='center' spacing={1}>
						<Grid item xs>
							<Typography
								color='inherit'
								variant='h5'
								component='h1'>
								{headerText}
							</Typography>
						</Grid>
						<Grid item>
							<Button
								onClick={contactLinkClicked}
								className={classes.button}
								variant='outlined'
								color='inherit'
								size='small'>
								Contact
							</Button>
						</Grid>
						<Grid item>
							<Tooltip title='Enable / Disable All Tooltips'>
								<IconButton color='inherit'>
									<HelpIcon />
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<AppBar
				component='div'
				className={classes.secondaryBar}
				color='primary'
				position='static'
				elevation={0}>
				<Tabs value={value} onChange={handleChange} textColor='inherit'>
					{tabs.map((tab) => (
						<Tab
							to={`${tab.link}`}
							textColor='inherit'
							label={tab.label}
							key={tab.label}
							component={Link}
						/>
					))}
				</Tabs>
			</AppBar>
		</Fragment>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	onDrawerToggle: PropTypes.func.isRequired,
	headerText: PropTypes.string.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default withStyles(styles)(connect(mapStateToProps)(Header));
