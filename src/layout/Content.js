import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ReloadIcon from '@material-ui/icons/Replay';
import MappingIcon from '@material-ui/icons/AccountTreeRounded';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
});

function Content(props) {
	const {
		classes,
		tabs,
		content,
		buttonText,
		buttonFunction,
		parentCallback,
		showEdit,
		editCallback,
		showReload,
		reloadCallback,
		selectedTabIndex,
		showMapping,
		mappingCallback,
		hideButton,
		showForward,
		showBack,
		forwardCallback,
		backCallback,
	} = props;
	const [value, setValue] = React.useState(
		selectedTabIndex > -1 ? selectedTabIndex : 0
	);
	const [editClicked, setEditClicked] = React.useState(false);
	const [mappingClicked, setMappingClicked] = React.useState(false);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		parentCallback(tabs[newValue]);
	};

	const editButtonClicked = () => {
		editCallback(!editClicked);
		setEditClicked(!editClicked);
	};

	const mappingButtonClicked = () => {
		mappingCallback(!mappingClicked);
		setMappingClicked(!mappingClicked);
	};

	return (
		<Paper className={classes.paper} elevation={3}>
			<AppBar
				className={classes.searchBar}
				position='static'
				color='default'
				elevation={0}>
				<Toolbar>
					<Grid
						container
						spacing={0}
						alignItems='center'
						justify='flex-end'
						direction='row'>
						<Grid item>
							<Tabs
								value={value}
								onChange={handleChange}
								textColor='primary'>
								{tabs.map((tabLabel) => (
									<Tab
										textColor='inherit'
										label={tabLabel}
										key={tabLabel}
									/>
								))}
							</Tabs>
						</Grid>
						<Grid item xs></Grid>
						{showBack ? (
							<Grid item>
								<Tooltip title='Previous Program'>
									<IconButton onClick={backCallback}>
										<ChevronLeftIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						) : (
							''
						)}
						{showForward ? (
							<Grid item>
								<Tooltip title='Next Program'>
									<IconButton onClick={forwardCallback}>
										<ChevronRightIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						) : (
							''
						)}
						{showReload ? (
							<Grid item>
								<Tooltip title='Reload Data'>
									<IconButton onClick={reloadCallback}>
										<ReloadIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						) : (
							''
						)}
						{showEdit ? (
							<Grid item>
								<Tooltip
									id='edit_tooltip'
									title='Edit Mappings'>
									<IconButton
										disabled={true}
										id='edit_button'
										style={{
											marginRight: '10px',
										}}
										onClick={editButtonClicked}>
										<EditIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						) : (
							''
						)}
						{showMapping ? (
							<Grid item>
								<Tooltip
									id='mapping_tooltip'
									title='Show Mapped Data'>
									<IconButton
										id='mapping_button'
										style={{
											marginRight: '10px',
										}}
										onClick={mappingButtonClicked}>
										<MappingIcon />
									</IconButton>
								</Tooltip>
							</Grid>
						) : (
							''
						)}
						{hideButton ? (
							''
						) : (
							<Grid item>
								<Tooltip title={buttonText}>
									<Button
										onClick={buttonFunction}
										variant='contained'
										color='primary'
										className={classes.addUser}>
										{buttonText}
									</Button>
								</Tooltip>
							</Grid>
						)}
					</Grid>
				</Toolbar>
			</AppBar>
			<div className={classes.contentWrapper}>{content}</div>
		</Paper>
	);
}

Content.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles)(Content);
