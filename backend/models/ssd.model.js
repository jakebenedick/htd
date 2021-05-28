const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let SSD = new Schema({
	ssd_id: {
		type: String,
	},
	ssd_requirement_text: {
		type: String,
	},
	ssd_status: {
		type: Boolean,
	},
	ssd_safety_control_list: {
		type: String,
	},
	ssd_program: {
		type: String,
	},
	ssd_mapped_sss: {
		type: String,
	},
});

module.exports = mongoose.model('SSD', SSD);
