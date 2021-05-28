import axios from 'axios';
import {
	GET_ERRORS,
	SET_CURRENT_NOTIFICATION,
	NOTIFICATION_LOADING,
} from './types';

// Store notification in DB.
export const createNotification = (notificationData, history) => (dispatch) => {
	axios
		.post('http://localhost:4000/api/users/register', notificationData)
		.then((res) => history.push('/login')) // re-direct to login on successful register
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

// Get Notification
export const getNotifications = () => (dispatch) => {
	axios
		.get(`http://localhost:4000/api/notifications/`)
		.then((res) => {
			// Set current notifications
			dispatch(setCurrentNotifications(decoded));
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

// Set current notifications
export const setCurrentNotifications = (decoded) => {
	return {
		type: SET_CURRENT_NOTIFICATION,
		payload: decoded,
	};
};

// Notification loading
export const setNotificationLoading = () => {
	return {
		type: NOTIFICATION_LOADING,
	};
};

// Mark notification as read.
export const markAllAsRead = () => (dispatch) => {
	// Set current notifiacations to empty object array []c
	dispatch(setCurrentNotifications([]));
};
