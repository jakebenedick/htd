const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let HAZARD = new Schema({
	hazard_id: {
		type: String,
	},
	hazard_description: {
		type: String,
	},
	hazard_severity: {
		type: Number,
	},
	hazard_likelihood: {
		type: String,
	},
	hazard_risk: {
		type: String,
	},
	hazard_supporting_document: {
		type: String,
	},
	hazard_program: {
		type: String,
	},
	hazard_sss_list: {
		type: String,
	},
});

module.exports = mongoose.model('HAZARD', HAZARD);
