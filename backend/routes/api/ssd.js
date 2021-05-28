const express = require('express');
const routes = express.Router();

// Load User model
const SSD = require('../../models/ssd.model');

//GET request for all SSDs
routes.route('/ssd/').get(function (req, res) {
	SSD.find(function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssds);
		}
	});
});

//GET request for 1 specific SSD by ssd_id - RETURNS 1 VALUE
routes.route('/ssd/:ssd_id').get(function (req, res) {
	let id = req.params.ssd_id;
	SSD.findOne({ ssd_id: id }, function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssds);
		}
	});
});

//GET request for specific SSD by ssd_id - RETURNS ARRAY OF VALUES
routes.route('/ssd/id/:ssd_id').get(function (req, res) {
	let id = req.params.ssd_id;
	SSD.find({ ssd_id: { $regex: id, $options: 'i' } }, function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssds);
		}
	});
});

//GET request for SSDs by ssd_ids - RETURNS ARRAY OF VALUES - ACCEPTS COMMA SEPARATED LIST OF VALUES
routes.route('/ssd/ids/:ssd_ids').get(function (req, res) {
	let ids = req.params.ssd_ids;
	ids = ids.split(',');

	SSD.find({ ssd_id: { $in: ids } }, function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssds);
		}
	});
});

//GET request for specific SSD by object _id - RETURNS 1 VALUE
routes.route('/ssd/object/:object_id').get(function (req, res) {
	let id = req.params.object_id;
	SSD.findOne({ _id: id }, function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(ssds);
		}
	});
});

//GET request for specific SSD without a specified id - returns empty json string - Prevents error message to console
routes.route('/ssd/id/').get(function (req, res) {
	SSD.find(function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific SSD by ssd_requirement_text - RETURNS ARRAY OF VALUES
routes
	.route('/ssd/requirement_text/:ssd_requirement_text')
	.get(function (req, res) {
		let requirement_text = req.params.ssd_requirement_text;
		SSD.find(
			{
				ssd_requirement_text: {
					$regex: requirement_text,
					$options: 'i',
				},
			},
			function (err, ssds) {
				if (err) {
					res.status(500).send(err.message);
				} else {
					res.json(ssds);
				}
			}
		);
	});

//GET request for specific SSD without a specified requirement text - returns empty json string - Prevents error message to console
routes.route('/ssd/requirement_text/').get(function (req, res) {
	SSD.find(function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific SSD by ssd_safety_control_list - RETURNS ARRAY OF VALUES
routes
	.route('/ssd/safety_control_list/:ssd_safety_control_list')
	.get(function (req, res) {
		let ssd_safety_control_list = req.params.ssd_safety_control_list;
		SSD.find(
			{
				ssd_safety_control_list: {
					$regex: ssd_safety_control_list,
					$options: 'i',
				},
			},
			function (err, ssds) {
				if (err) {
					res.status(500).send(err.message);
				} else {
					res.json(ssds);
				}
			}
		);
	});

//GET request for specific SSD without a specified safety control list - returns empty json string - Prevents error message to console
routes.route('/ssd/safety_control_list/').get(function (req, res) {
	SSD.find(function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific SSD by ssd_status - RETURNS ARRAY OF VALUES
routes.route('/ssd/status/:ssd_status').get(function (req, res) {
	let ssd_status = req.params.ssd_status;
	SSD.find(
		{
			ssd_status: ssd_status,
		},
		function (err, ssds) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(ssds);
			}
		}
	);
});

//GET request for SSS by ssd_program - Returns an array of values
routes.route('/ssd/program/:ssd_program').get(function (req, res) {
	let program = req.params.ssd_program;
	SSD.find(
		{ ssd_program: { $regex: program, $options: 'i' } },
		function (err, ssds) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(ssds);
			}
		}
	);
});

//GET request for specific SSD without a specified status - returns empty json string - Prevents error message to console
routes.route('/ssd/status/').get(function (req, res) {
	SSD.find(function (err, ssds) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//POST request for new SSD
routes.route('/ssd/add').post(function (req, res) {
	let ssds = new SSD(req.body);
	ssds.save()
		.then((ssds) => {
			res.status(200).json({ ssds: 'SSD added successfully: ' + ssds });
		})
		.catch((err) => {
			res.status(400).send('Adding new SSD failed: ' + err.message);
		});
});

//POST request to update a specific SSD by ssd_id
routes.route('/ssd/update/:ssd_id').post(function (req, res) {
	let id = req.params.ssd_id;

	SSD.findOne({ ssd_id: id }, function (err, ssds) {
		if (!ssds) res.status(404).send('data is not found');
		else ssds.ssd_id = req.body.ssd_id;
		ssds.ssd_requirement_text = req.body.ssd_requirement_text;
		ssds.ssd_safety_control_list = req.body.ssd_safety_control_list;
		ssds.ssd_status = req.body.ssd_status;
		ssds.ssd_program = req.body.ssd_program;
		ssds.ssd_mapped_sss = req.body.ssd_mapped_sss;
		ssds.save()
			.then((ssds) => {
				res.status(200).json(ssds);
			})
			.catch((err) => {
				res.status(400).send('Update not possible: ' + err.message);
			});
	});

	/* SSD.findOneAndUpdate(
		{ ssd_id: id },
		{
			$set: {
				ssd_requirement_text: req.body.ssd_requirement_text,
				ssd_safety_control_list: req.body.ssd_safety_control_list,
				ssd_status: req.body.ssd_status,
				ssd_program: req.body.ssd_program,
				ssd_mapped_sss: req.body.ssd_mapped_sss,
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

//DELETE request for a specific ssd by ssd_id
routes.route('/ssd/delete/:ssd_id').delete(function (req, res) {
	let id = req.params.ssd_id;

	SSD.deleteOne({ ssd_id: id }, function (err, hazards) {
		if (err) res.status(404).send('SSD is not found');
		else res.status(204).send('SSD has been deleted');
	});
});

module.exports = routes;
