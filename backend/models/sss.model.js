const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let SSS = new Schema({
	sss_id: {
		type: String,
	},
	sss_requirement_text: {
		type: String,
	},
	sss_status: {
		type: Boolean,
	},
	sss_failing_list: {
		type: String,
	},
	sss_blocking_list: {
		type: String,
	},
	sss_other_list: {
		type: String,
	},
	sss_program: {
		type: String,
	},
	sss_mapped_ssd: {
		type: String,
	},
});

module.exports = mongoose.model('SSS', SSS);
