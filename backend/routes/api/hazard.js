const express = require('express');
const routes = express.Router();

// Load User model
const HAZARD = require('../../models/hazard.model');

//GET request for all hazards - RETURNS ARRAY OF VALUES
routes.route('/hazard').get(function (req, res) {
	HAZARD.find(function (err, hazards) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(hazards);
		}
	});
});

//GET request for hazard without a specified id - returns empty json string - Prevents error message to console
routes.route('/hazard/id/').get(function (req, res) {
	HAZARD.find(function (err, hazards) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific hazard by object _id - RETURNS 1 VALUE
routes.route('/hazard/object/:object_id').get(function (req, res) {
	let id = req.params.object_id;
	HAZARD.findOne({ _id: id }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(hazard);
		}
	});
});

//GET request for specific hazard by hazard_id - RETURNS 1 VALUE
routes.route('/hazard/:hazard_id').get(function (req, res) {
	var id = req.params.hazard_id;

	HAZARD.findOne({ hazard_id: id }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(hazard);
		}
	});
});

//GET request for specific hazard by hazard_id
routes.route('/hazard/id/:hazard_id').get(function (req, res) {
	var id = req.params.hazard_id;

	HAZARD.find(
		{ hazard_id: { $regex: id, $options: 'i' } },
		function (err, hazard) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazard);
			}
		}
	);
});

//GET request for specific hazard by hazard_description
routes
	.route('/hazard/description/:hazard_description')
	.get(function (req, res) {
		let description = req.params.hazard_description;
		HAZARD.find(
			{ hazard_description: { $regex: description, $options: 'i' } },
			function (err, hazard) {
				if (err) {
					res.status(500).send(err.message);
				} else {
					res.json(hazard);
				}
			}
		);
	});

//GET request for specific hazard without a specified description - returns empty json string - Prevents error message to console
routes.route('/hazard/description/').get(function (req, res) {
	//let description = req.params.hazard_description;
	HAZARD.find({ hazard_description: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific hazard by hazard_likelihood
routes.route('/hazard/likelihood/:hazard_likelihood').get(function (req, res) {
	let likelihood = req.params.hazard_likelihood;
	HAZARD.find(
		{ hazard_likelihood: { $regex: likelihood, $options: 'i' } },
		function (err, hazard) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazard);
			}
		}
	);
});

//GET request for specific hazard without a specified likelihood - returns empty json string - Prevents error message to console
routes.route('/hazard/likelihood/').get(function (req, res) {
	//let likelihood = req.params.hazard_likelihood;
	HAZARD.find({ hazard_likelihood: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific hazard by hazard_risk
routes.route('/hazard/risk/:hazard_risk').get(function (req, res) {
	let risk = req.params.hazard_risk;
	HAZARD.find(
		{ hazard_risk: { $regex: risk, $options: 'i' } },
		function (err, hazard) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazard);
			}
		}
	);
});

//GET request for specific hazard without a specified risk - returns empty json string - Prevents error message to console
routes.route('/hazard/risk/').get(function (req, res) {
	//let risk = req.params.hazard_risk;
	HAZARD.find({ hazard_risk: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific hazard by hazard_severity
routes.route('/hazard/severity/:hazard_severity').get(function (req, res) {
	let severity = req.params.hazard_severity;
	HAZARD.find({ hazard_severity: severity }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(hazard);
		}
	});
});

//GET request for specific hazard without a specified severity - returns empty json string - Prevents error message to console
routes.route('/hazard/severity/').get(function (req, res) {
	//let severity = req.params.hazard_severity;
	HAZARD.find({ hazard_severity: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for specific hazard by hazard_document
routes
	.route('/hazard/supporting_document/:hazard_document')
	.get(function (req, res) {
		let document = req.params.hazard_document;
		HAZARD.find(
			{ hazard_supporting_document: { $regex: document, $options: 'i' } },
			function (err, hazard) {
				if (err) {
					res.status(500).send(err.message);
				} else {
					res.json(hazard);
				}
			}
		);
	});

//GET request for specific hazard without a specified document - returns empty json string - Prevents error message to console
routes.route('/hazard/supporting_document/').get(function (req, res) {
	//let document = req.params.hazard_risk;
	HAZARD.find({ hazard_document: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for hazard by hazard_sss_list - RETURNS an array
routes.route('/hazard/sss_list/:sss_list').get(function (req, res) {
	let sss_list = req.params.sss_list;
	HAZARD.find(
		{ hazard_sss_list: { $regex: sss_list, $options: 'i' } },
		function (err, hazard) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazard);
			}
		}
	);
});

//GET request for hazard without a specified sss_list - returns empty json string - Prevents error message to console
routes.route('/hazard/sss_list/').get(function (req, res) {
	//let document = req.params.hazard_risk;
	HAZARD.find({ hazard_list: '' }, function (err, hazard) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for all medium risk hazards by program
routes.route('/hazard/mediumRisk/:hazard_program').get(function (req, res) {
	let program = req.params.hazard_program;
	HAZARD.find(
		{
			hazard_program: { $regex: program, $options: 'i' },
			hazard_risk: 'Medium',
		},
		function (err, hazard) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazard);
			}
		}
	);
});

//GET request for hazards by hazard program - RETURNS an array of values
routes.route('/hazard/program/:hazard_program').get(function (req, res) {
	let program = req.params.hazard_program;
	HAZARD.find(
		{
			hazard_program: { $regex: program, $options: 'i' },
		},
		function (err, hazards) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(hazards);
			}
		}
	);
});

//POST request for new hazard
routes.route('/hazard/add').post(function (req, res) {
	let hazards = new HAZARD(req.body);
	hazards
		.save()
		.then((hazards) => {
			res.status(200).json({
				hazards: 'Hazard added successfully: ' + hazards,
			});
		})
		.catch((err) => {
			res.status(400).send('Adding new hazard failed: ' + err.message);
		});
});

//POST request to update a specific hazard by hazard_id
routes.route('/hazard/update/:hazard_id').post(function (req, res) {
	let id = req.params.hazard_id;

	HAZARD.findOne({ hazard_id: id }, function (err, hazards) {
		if (!hazards) res.status(404).send('data is not found');
		else hazards.hazard_id = req.body.hazard_id;
		hazards.hazard_description = req.body.hazard_description;
		hazards.hazard_likelihood = req.body.hazard_likelihood;
		hazards.hazard_risk = req.body.hazard_risk;
		hazards.hazard_severity = req.body.hazard_severity;
		hazards.hazard_supporting_document =
			req.body.hazard_supporting_document;
		hazards.hazard_sss_list = req.body.hazard_sss_list;
		hazards.hazard_program = req.body.hazard_program;
		hazards.hazard_status = req.body.hazard_status;
		hazards
			.save()
			.then((hazards) => {
				res.status(200).json(hazards);
			})
			.catch((err) => {
				res.status(400).send('Update not possible: ' + err.message);
			});
	});

	/* HAZARD.findOneAndUpdate(
		{ hazard_id: id },
		{
			$set: {
				hazard_severity: req.body.hazard_severity,
				hazard_likelihood: req.body.hazard_likelihood,
				hazard_risk: req.body.hazard_risk,
				hazard_supporting_document: req.body.hazard_supporting_document,
				hazard_description: req.body.hazard_description,
				hazard_program: req.body.hazard_program,
				hazard_sss_list: req.body.hazard_sss_list,
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

//DELETE request for a specific hazard by hazard_id
routes.route('/hazard/delete/:hazard_id').delete(function (req, res) {
	let id = req.params.hazard_id;

	HAZARD.findOneAndDelete({ hazard_id: id }, function (err, hazards) {
		if (err) res.status(404).send('Hazard is not found');
		else res.status(200).json(hazards);
	});
});

module.exports = routes;
