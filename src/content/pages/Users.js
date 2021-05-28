import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Paper, Grid, Avatar } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import OnlineBadge from '../../layout/OnlineBadge';
import SpeedDial from '../../layout/SpeedDial';
import Alert from '../../utils/Confirmation Prompt';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	card: {
		minHeight: '40vh',
		minWidth: '20vw',
		overflow: 'hidden',
		position: 'relative',
	},
	background: {
		height: '100%',
		width: '100%',
		backgroundColor: '#850F88',
		clipPath: 'polygon(0 0, 0 50%, 100% 0)',
		border: 'solid 1px transparent',
		zIndex: 0,
		position: 'absolute',
	},
	avatar: {
		margin: 'auto',
		height: '150px',
		width: '150px',
		marginTop: '25%',
		backgroundColor: '#1F1646',
	},
	content: {
		textAlign: 'center',
		position: 'relative',
		zIndex: 100,
		color: '#1F1646',
	},
}));

function Users(props) {
	const [users, setUsers] = React.useState([]);
	const [activeIndex, setActiveIndex] = React.useState(-1);
	const [isOpenDelete, setIsOpenDelete] = React.useState(false);
	const [isOpenEdit, setIsOpenEdit] = React.useState(false);
	const [isOpenResetPassword, setIsOpenResetPassword] = React.useState(false);
	const classes = useStyles();
	const { user } = props.auth;

	useEffect(() => {
		axios.get(`http://localhost:4000/api/users`).then((res) => {
			if (res.status !== 500) {
				setUsers(res.data);
				//console.log('New Data loaded');
			}
		});
	}, []);

	const getInitials = (name) => {
		var names = name.split(' ');
		var initials = names[0].charAt(0) + '' + names[1].charAt(0);

		return initials;
	};

	const onDoubleClick = (i) => {
		//console.log('Hovering over object with index: ' + i);

		if (user.level === 'Admin') {
			if (activeIndex === i) {
				setActiveIndex(-1);
			} else {
				setActiveIndex(i);
			}
		}
	};

	const deleteUser = () => {
		setIsOpenDelete(true);
	};

	const handleDeleteAlertCloseFalse = () => {
		setIsOpenDelete(false);
	};

	const handleDeleteAlertCloseTrue = (i) => {
		if (i !== -1) {
			setUsers(
				users.filter(function filterByIndex(el, index) {
					return index !== i;
				})
			);

			axios
				.delete(
					`http://localhost:4000/api/users/email/${users[i].email}`
				)
				.then((res) => {
					if (res.status === 200) {
						console.log('Success' + res.data);
					} else {
						console.log('Something went wrong! ' + res.data);
					}
				});
		}

		setIsOpenDelete(false);
	};

	const editButtonClicked = () => {
		setIsOpenEdit(true);
	};

	const handleEditAlertCloseFalse = () => {
		setIsOpenEdit(false);
	};

	const handleEditAlertCloseTrue = (activeIndex) => {
		if (users[activeIndex].level === 'Admin') {
			users[activeIndex].level = 'User';
		} else users[activeIndex].level = 'Admin';

		axios
			.post(
				`http://localhost:4000/api/users/update/level/${users[activeIndex].email}`
			)
			.then((res) => {
				if (res.status === 200) {
					console.log('Success' + res.data);
				} else {
					console.log('Something went wrong! ' + res.data);
				}
			});

		setIsOpenEdit(false);
	};

	const resetPassword = () => {
		setIsOpenResetPassword(true);
	};

	const handleResetAlertCloseFalse = () => {
		setIsOpenResetPassword(false);
	};

	const handleResetAlertCloseTrue = (activeIndex) => {
		setIsOpenEdit(false);
	};

	const actions = [
		{
			icon: <EditIcon />,
			name: 'Toggle Admin Rights',
			func: editButtonClicked,
		},
		{
			icon: <DeleteIcon />,
			name: 'Delete',
			func: deleteUser,
		},
		{
			icon: <VpnKeyIcon />,
			name: 'Reset Password',
			func: () => resetPassword(activeIndex),
		},
	];

	return (
		<div>
			<Grid container className={classes.root} spacing={2}>
				<Grid item xs={12}>
					<Grid
						container
						justify='flex-start'
						alignItems='flex-start'
						spacing={4}>
						{users.length > 0
							? users.map((userLoaded, i) => (
									<Grid
										key={i}
										item
										onDoubleClick={() => onDoubleClick(i)}>
										<Paper
											className={classes.card}
											elevation={2}>
											<div
												className={
													classes.background
												}></div>
											<div className={classes.content}>
												<SpeedDial
													actions={actions}
													hidden={activeIndex !== i}
												/>
												<OnlineBadge
													online={true}
													content={
														<Avatar
															className={
																classes.avatar
															}>
															{getInitials(
																userLoaded.name
															)}
														</Avatar>
													}></OnlineBadge>
												<div style={{ margin: '15%' }}>
													<h3
														style={{
															fontWeight: 'bold',
														}}>
														{userLoaded.name}
													</h3>
													<p>{userLoaded.email}</p>

													<b>Account Type: </b>
													<span>
														{userLoaded.level}
													</span>
												</div>
											</div>
											<Alert
												title='Confirm Delete'
												text='Are you sure you would like to delete this user from the HTD?  This operation cannot be undone.'
												isOpen={isOpenDelete}
												handleCloseFalse={
													handleDeleteAlertCloseFalse
												}
												handleCloseTrue={() =>
													handleDeleteAlertCloseTrue(
														activeIndex
													)
												}></Alert>
											<Alert
												title='Confirm Account Type Edit'
												text='Are you sure you would like to edit the account type for this user?  This operation cannot be undone.'
												isOpen={isOpenEdit}
												handleCloseFalse={
													handleEditAlertCloseFalse
												}
												handleCloseTrue={() =>
													handleEditAlertCloseTrue(
														activeIndex
													)
												}></Alert>
											<Alert
												title='Confirm Password Reset'
												text='Are you sure you would like to reset the password for this user?  This operation cannot be undone.'
												isOpen={isOpenResetPassword}
												handleCloseFalse={
													handleResetAlertCloseFalse
												}
												handleCloseTrue={() =>
													handleResetAlertCloseTrue(
														activeIndex
													)
												}></Alert>
										</Paper>
									</Grid>
							  ))
							: 'No user information has been loaded for the application.  This is most likely an error.  Check with the system admin.'}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

Users.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Users);
