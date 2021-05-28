const express = require('express');
const router = express.Router();

// Load Notification model
const NOTIFICATION = require('../../models/notification.model');

//GET request for all notifications - RETURNS ARRAY OF VALUES
router.route('/notification').get(function (req, res) {
	NOTIFICATION.find(function (err, notifications) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(notifications);
		}
	});
});

//GET request for notification without a specified user - returns empty json string - Prevents error message to console
router.route('/notification/user/').get(function (req, res) {
	NOTIFICATION.find(function (err, notifications) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json('');
		}
	});
});

//GET request for notifications for a specific user - also returns notifications with a userTo value of 'everyone'
router.route('/notification/user/:user').get(function (req, res) {
	var ids = req.params.user + ',' + 'everyone';
	ids = ids.split(',');

	NOTIFICATION.find({ userTo: { $in: ids } }, function (err, notifications) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(notifications);
		}
	});
});

//GET request for notifications from a specific user
router.route('/notification/from/:from').get(function (req, res) {
	var ids = req.params.from;

	NOTIFICATION.find(
		{ userFrom: { $regex: ids, $options: 'i' } },
		function (err, notifications) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(notifications);
			}
		}
	);
});

//GET request for notifications that have occurred in the past month
router.route('/notification/month').get(function (req, res) {
	var monthData = new Date();
	monthData.setMonth(monthData.getMonth() - 1);

	NOTIFICATION.find(
		{ time: { $gte: monthData } },
		function (err, notifications) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.json(notifications);
			}
		}
	);
});

//POST request for new notification
router.route('/notification/add').post(function (req, res) {
	let notifications = new NOTIFICATION(req.body);
	notifications
		.save()
		.then((notifications) => {
			res.status(200).json({
				notifications:
					'Notification added successfully: ' + notifications,
			});
		})
		.catch((err) => {
			res.status(400).send(
				'Adding new notification failed: ' + err.message
			);
		});
});

//POST request to mark a notification as read for a user
router
	.route('/notification/read/:notification_id/:user')
	.post(function (req, res) {
		let id = req.params.notification_id;
		let name = req.params.user;

		NOTIFICATION.findOne({ _id: id }, function (err, notifications) {
			if (!notifications) res.status(404).send('data is not found');
			else {
				if (notifications.read === '') {
					notifications.read = notifications.read + name;
				} else {
					notifications.read = notifications.read + ', ' + name;
				}
			}

			notifications
				.save()
				.then((notification) => {
					res.status(200).json(
						notification + ' Marked as read by ' + name
					);
				})
				.catch((err) => {
					res.status(400).send(
						'Could not mark as read: ' + err.message
					);
				});
		});
	});

//POST request to mark all notifications as read for a user
router.route('/notification/read/:user').post(function (req, res) {
	let name = req.params.user;

	NOTIFICATION.updateMany(
		{ read: { $not: { $regex: name } } },
		[{ $set: { read: { $concat: ['$read', `, ${name}`] } } }],
		function (err) {
			if (err) res.status(404).send(err.message);
			else res.status(200).send('Success!');
		}
	);
});

module.exports = router;
