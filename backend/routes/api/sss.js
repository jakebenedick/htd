const express = require('express');
const routes = express.Router();

// Load SSS model
const SSS = require('../../models/sss.model');

//GET request for all SSSs - RETURNS ARRAY OF VALUES
routes.route('/sss/').get(function (req, res) {
	SSS.find(function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for specific SSS by sss_id - RETURNS 1 VALUE
routes.route('/sss/:sss_id').get(function (req, res) {
	let id = req.params.sss_id;
	SSS.findOne({ sss_id: id }, function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for SSS by sss_id - RETURNS ARRAY OF VALUES
routes.route('/sss/id/:sss_id').get(function (req, res) {
	let id = req.params.sss_id;

	SSS.find({ sss_id: { $regex: id, $options: 'i' } }, function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for SSSs by sss_ids - RETURNS ARRAY OF VALUES - ACCEPTS COMMA SEPARATED LIST OF VALUES
routes.route('/sss/ids/:sss_ids').get(function (req, res) {
	let ids = req.params.sss_ids;
	ids = ids.split(',');

	SSS.find({ sss_id: { $in: ids } }, function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for specific SSS by object _id
routes.route('/sss/object/:object_id').get(function (req, res) {
	let id = req.params.object_id;
	SSS.findOne({ _id: id }, function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for specific SSS without a specified id - returns empty json string - Prevents error message to console
routes.route('/sss/id/').get(function (req, res) {
	SSS.find(function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for SSS by sss_program - Returns an array of values
routes.route('/sss/program/:sss_program').get(function (req, res) {
	let program = req.params.sss_program;
	SSS.find(
		{ sss_program: { $regex: program, $options: 'i' } },
		function (err, ssss) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(ssss);
			}
		}
	);
});

//GET request for SSS by sss_status - Returns an array of values
routes.route('/sss/status/:sss_status').get(function (req, res) {
	let status = req.params.sss_status;
	SSS.find({ sss_status: status }, function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssss);
		}
	});
});

//GET request for SSS without a specified status - returns empty json string - Prevents error message to console
routes.route('/sss/status/').get(function (req, res) {
	SSS.find(function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific SSS by sss_text
routes.route('/sss/requirement_text/:sss_text').get(function (req, res) {
	let text = req.params.sss_text;
	SSS.find(
		{
			sss_text: {
				$regex: text,
				$options: 'i',
			},
		},
		function (err, ssss) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(ssss);
			}
		}
	);
});

//GET request for specific SSS without a specified requirement text - returns empty json string - Prevents error message to console
routes.route('/sss/requirement_text/').get(function (req, res) {
	SSS.find(function (err, ssss) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//POST request for new SSS
routes.route('/sss/add').post(function (req, res) {
	let ssss = new SSS(req.body);
	ssss.save()
		.then((ssss) => {
			res.status(200).json({ ssss: 'SSS added successfully: ' + ssss });
		})
		.catch((err) => {
			res.status(400).send('Adding new SSS failed: ' + err.message);
		});
});

//POST request to update a specific SSS by sss_id
routes.route('/sss/update/:sss_id').post(function (req, res) {
	let id = req.params.sss_id;

	SSS.findOne({ sss_id: id }, function (err, ssss) {
		if (!ssss) res.status(404).send('data is not found');
		else ssss.sss_id = req.body.sss_id;
		ssss.sss_requirement_text = req.body.sss_requirement_text;
		ssss.sss_status = req.body.sss_status;
		ssss.sss_program = req.body.sss_program;
		ssss.sss_failing_list = req.body.sss_failing_list;
		ssss.sss_blocking_list = req.body.sss_blocking_list;
		ssss.sss_other_list = req.body.sss_other_list;
		ssss.sss_mapped_ssd = req.body.sss_mapped_ssd;

		ssss.save()
			.then((ssss) => {
				res.status(200).json(ssss);
			})
			.catch((err) => {
				res.status(400).send('Update not possible: ' + err.message);
			});
	});

	/* SSS.findOneAndUpdate(
		{ sss_id: id },
		{
			$set: {
				sss_requirement_text: req.body.sss_requirement_text,
				sss_other_list: req.body.sss_other_list,
				sss_status: req.body.sss_status,
				sss_program: req.body.sss_program,
				sss_mapped_ssd: req.body.sss_mapped_ssd,
				sss_failing_list: req.body.sss_failing_list,
				sss_blocking_list: req.body.sss_blocking_list,
			},
		},
		{ useFindAndModify: false, upsert: false },
		function (err, result) {
			if (err) {
				res.status(400).send('Update not possible: ' + err.message);
			} else {
				res.status(200).json(result);
			}
		}
	); */
});

//DELETE request for a specific sss by sss_id
routes.route('/sss/delete/:sss_id').delete(function (req, res) {
	let id = req.params.sss_id;

	SSS.deleteOne({ sss_id: id }, function (err, hazards) {
		if (err) res.status(404).send('SSS is not found');
		else res.status(204).send('SSS has been deleted');
	});
});

module.exports = routes;
