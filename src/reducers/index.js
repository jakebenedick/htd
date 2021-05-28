import { combineReducers } from 'redux';
import authReducer from './authReducers';
import errorReducer from './errorReducers';
import notificationReducer from './notificationReducers';

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	notifications: notificationReducer,
});
