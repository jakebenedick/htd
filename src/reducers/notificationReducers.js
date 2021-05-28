import {
	SET_CURRENT_NOTIFICATION,
	NOTIFICATION_LOADING,
} from '../actions/types';

const isEmpty = require('is-empty');

const initialState = {
	isRead: false,
	notification: {},
	loading: false,
};
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_NOTIFICATION:
			return {
				...state,
				isRead: !isEmpty(action.payload),
				notification: action.payload,
			};
		case NOTIFICATION_LOADING:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}
