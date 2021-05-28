const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ANALYTIC = new Schema({
	date: {
		type: String,
	},
	number_of_hazards: {
		type: Number,
	},
	number_of_reports: {
		type: Number,
	},
	number_of_ssd: {
		type: Number,
	},
	number_of_sss: {
		type: Number,
	},
});

module.exports = mongoose.model('ANALYTIC', ANALYTIC);
