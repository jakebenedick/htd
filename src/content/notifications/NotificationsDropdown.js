import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
//eslint-disable-next-line
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
	IconButton,
	Button,
	Typography,
	Card,
	CardActions,
	CardContent,
	Tooltip,
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles({
	root: {
		width: 275,
		position: 'fixed',
		top: '50px',
		right: '70px',
		textAlign: 'left',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black',
		float: 'left',
	},
	text: {
		fontSize: '12px',
		float: 'left',
	},
	time: {
		float: 'right',
		fontSize: '12px',
	},
	date: {
		float: 'left',
		fontSize: '12px',
		margin: '0px 0px 0px 5px',
		fontWeight: 'bold',
		color: 'gray',
	},
	pos: {
		marginBottom: 12,
	},
	unread: {
		backgroundColor: 'rgba(133, 15, 136, .3)',
	},
	header: {
		textAlign: 'left',
		fontWeight: 'bold',
		marginLeft: '5px',
		marginBottom: '20px',
	},
	notification: {
		margin: '10px 5px',
		height: '100px',
		float: 'left',
	},
});

function NotificationsDropdown(props) {
	const { style } = props;
	const classes = useStyles();
	const history = useHistory();
	const { user } = props.auth;
	const [notificationData, setNotificationData] = React.useState([]);
	const [update, setUpdate] = React.useState(false);

	useEffect(() => {
		axios
			.get(`http://localhost:4000/notification/user/${user.name}`)
			.then((res) => {
				//console.log(res.data);

				res.data.sort(function (a, b) {
					var c = new Date(a.time);
					var d = new Date(b.time);
					return d - c;
				});

				let tempArray = [];
				for (let i = 0; i < res.data.length; i++) {
					let tempDate =
						toMonthString(new Date(res.data[i].time).getMonth()) +
						' ' +
						new Date(res.data[i].time).getDate();

					//myArray.map((x) => x.hello).indexOf('stevie');

					if (tempArray.map((x) => x.date).indexOf(tempDate) === -1) {
						tempArray.push({ date: tempDate, data: [res.data[i]] });
					} else {
						tempArray[
							tempArray.map((x) => x.date).indexOf(tempDate)
						].data.push(res.data[i]);
					}
				}
				setNotificationData(tempArray);
				//console.log(tempArray);
			});
	}, [user.name, update]);

	const markAsRead = (noti) => {
		axios
			.post(
				`http://localhost:4000/notification/read/${noti._id}/${user.name}`
			)
			.then((res) => {
				setUpdate(!update);
			});
		history.push(`/Notifications/${noti._id}`);
	};

	const markAllAsRead = () => {
		axios
			.post(`http://localhost:4000/notification/read/${user.name}`)
			.then((res) => {
				setUpdate(!update);
			});

		history.go(0);
	};

	const toMonthString = (monthInt) => {
		switch (monthInt) {
			case 0:
				return 'Jan';
			case 1:
				return 'Feb';
			case 2:
				return 'Mar';
			case 3:
				return 'Apr';
			case 4:
				return 'May';
			case 5:
				return 'Jun';
			case 6:
				return 'Jul';
			case 7:
				return 'Aug';
			case 8:
				return 'Sep';
			case 9:
				return 'Oct';
			case 10:
				return 'Nov';
			case 11:
				return 'Dec';
			default:
				return '';
		}
	};

	return (
		<Card style={style} className={classes.root} variant='outlined'>
			<CardContent>
				<h5 className={classes.header}>Notifications</h5>
				{notificationData && notificationData.length > 0 ? (
					notificationData.slice(0, 2).map((notification) => (
						<Fragment>
							<Typography
								variant='body1'
								component='p'
								className={classes.date}>
								{notification.date}
							</Typography>
							{notification.data.slice(0, 2).map((noti) => {
								let date = new Date(noti.time);

								return (
									<Card
										onClick={() => markAsRead(noti)}
										className={
											noti.read.includes(user.name)
												? classes.notification
												: classes.unread +
												  ' ' +
												  classes.notification
										}>
										<CardContent>
											<Typography
												className={classes.title}
												color='textSecondary'
												gutterBottom>
												{noti.header}
											</Typography>
											<Typography
												className={classes.time}>
												{(date.getHours() > 12
													? date.getHours() - 12
													: date.getHours()) +
													':' +
													(date.getMinutes() >= 10
														? date.getMinutes()
														: '0' +
														  date.getMinutes()) +
													(date.getHours() > 12
														? ' PM'
														: ' AM')}
											</Typography>
											<Typography
												variant='body1'
												component='p'
												className={classes.text}>
												{noti.text}
											</Typography>
										</CardContent>
									</Card>
								);
							})}
						</Fragment>
					))
				) : (
					<p style={{ marginLeft: '5px' }}>
						No notifications to show.
					</p>
				)}
			</CardContent>
			<CardActions style={{ float: 'right' }}>
				<Button
					size='medium'
					style={{ color: '#850F88' }}
					onClick={() => history.push('/Notifications')}>
					See all notifications
				</Button>
				<Tooltip title='Mark all notifications as read.'>
					<IconButton
						size='medium'
						style={{ color: '#850F88' }}
						onClick={markAllAsRead}>
						<Check />
					</IconButton>
				</Tooltip>
			</CardActions>
		</Card>
	);
}

NotificationsDropdown.propTypes = {};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(NotificationsDropdown);
