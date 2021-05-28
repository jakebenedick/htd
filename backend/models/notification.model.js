const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const NotificationSchema = new Schema({
	userTo: {
		type: String,
		required: true,
	},
	userFrom: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	changedObjects: {
		type: Array,
		default: [],
	},
	header: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		default: Date.now,
	},
	read: {
		type: String,
		default: '',
	},
});

module.exports = mongoose.model('NOTIFICATION', NotificationSchema);
