import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LeidosIcon from '../images/leidos_logo.png';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import MappingIcon from '@material-ui/icons/AccountTreeRounded';
//import TrackingIcon from '@material-ui/icons/AssessmentRounded';
import ReportIcon from '@material-ui/icons/Print';
import SearchIcon from '@material-ui/icons/Search';
import PublishIcon from '@material-ui/icons/Publish';
import InfoIcon from '@material-ui/icons/Info';
//eslint-disable-next-line
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

const styles = (theme) => ({
	categoryHeader: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	categoryHeaderPrimary: {
		color: theme.palette.common.white,
	},
	item: {
		paddingTop: 1,
		paddingBottom: 1,
		color: 'rgba(255, 255, 255, 0.7)',
		'&:hover,&:focus': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
	},
	itemCategory: {
		backgroundColor: '#232f3e',
		boxShadow: '0 -1px 0 #404854 inset',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	firebase: {
		fontSize: 22,
		color: theme.palette.common.white,
	},
	itemActiveItem: {
		color: '#850F88',
	},
	itemPrimary: {
		fontSize: 'inherit',
	},
	itemIcon: {
		minWidth: 'auto',
		marginRight: theme.spacing(2),
	},
	divider: {
		marginTop: theme.spacing(2),
	},
});

function Navigator(props) {
	const { classes, ...other } = props;

	const isCurrentPage = (pageText) => {
		var urlString = window.location.href;
		urlString = urlString.toLowerCase();

		if (urlString.includes(pageText)) {
			return true;
		} else return false;
	};

	const [categories, setCategories] = React.useState([
		{
			id: 'Core Functions',
			children: [
				{
					id: 'Search',
					icon: <SearchIcon />,
					active: isCurrentPage('search'),
				},
				{
					id: 'Mapping',
					icon: <MappingIcon />,
					active: isCurrentPage('mapping'),
				},
				{
					id: 'Entry',
					icon: <DnsRoundedIcon />,
					active: isCurrentPage('entry'),
				},
				/* {
					id: 'Visualizations',
					icon: <TrackingIcon />,
					active: isCurrentPage('visualizations'),
				}, */
				{
					id: 'Reporting',
					icon: <ReportIcon />,
					active: isCurrentPage('reporting'),
				},
			],
		},
		{
			id: 'Additional Tools',
			children: [
				{
					id: 'Upload',
					icon: <PublishIcon />,
					active: isCurrentPage('upload'),
				},
				{
					id: 'Users',
					icon: <PeopleIcon />,
					active: isCurrentPage('users'),
				},
				{
					id: 'About',
					icon: <InfoIcon />,
					active: isCurrentPage('about'),
				},
			],
		},
	]);

	const handleClick = (text) => {
		var i, j;
		var arrayCopy = [...categories];

		for (i = 0; i < arrayCopy.length; i++) {
			for (j = 0; j < arrayCopy[i].children.length; j++) {
				if (arrayCopy[i].children[j].id === text) {
					arrayCopy[i].children[j].active = true;
				} else {
					arrayCopy[i].children[j].active = false;
				}
			}
		}
		isCurrentPage();
		setCategories(arrayCopy);
	};

	return (
		<Drawer variant='permanent' {...other}>
			<List disablePadding>
				<Link to={`/`} key={'Home'} style={{ textDecoration: 'none' }}>
					<ListItem
						className={clsx(
							classes.firebase,
							classes.item,
							classes.itemCategory
						)}>
						Hazard Tracking App
					</ListItem>

					<ListItem
						className={clsx(classes.item, classes.itemCategory)}
						style={{ fontSize: '18px' }}>
						<ListItemIcon className={classes.itemIcon}>
							<img
								src={LeidosIcon}
								alt='Leidos_logo'
								height='30px'></img>
						</ListItemIcon>
						Leidos
					</ListItem>
				</Link>
				{categories.map(({ id, children }) => (
					<React.Fragment key={id}>
						<ListItem className={classes.categoryHeader}>
							<ListItemText
								classes={{
									primary: classes.categoryHeaderPrimary,
								}}>
								{id}
							</ListItemText>
						</ListItem>
						{children.map(({ id: childId, icon, active }) => (
							<Link to={`/${childId}`} key={childId}>
								<ListItem
									onClick={() => handleClick(childId)}
									key={childId}
									button
									className={clsx(
										classes.item,
										active && classes.itemActiveItem
									)}>
									<ListItemIcon className={classes.itemIcon}>
										{icon}
									</ListItemIcon>
									<ListItemText
										classes={{
											primary: classes.itemPrimary,
										}}>
										{childId}
									</ListItemText>
								</ListItem>
							</Link>
						))}

						<Divider className={classes.divider} />
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
}

Navigator.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
