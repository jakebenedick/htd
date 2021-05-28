const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load User model
const User = require('../../models/user.model');
const { use } = require('./hazard');

// @route GET api/Users
// @desc Return all registered Users - only include name, email, and level
// @access Public
router.get('/', (req, res) => {
	User.find({}, { name: 1, email: 1, level: 1 }, function (err, users) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.json(users);
		}
	});
});

// @route POST api/users/update/level
// @desc Togggle user (By Email) permission level
// @access Public
router.post('/update/level/:email', function (req, res) {
	let user = req.params.email;

	User.findOne({ email: user }, function (err, user) {
		if (!user) res.status(404).send('data is not found');
		else {
			if (user.level === 'Admin') {
				user.level = 'User';
			} else user.level = 'Admin';

			user.save()
				.then((userResponse) => {
					res.status(200).json(userResponse);
				})
				.catch((err) => {
					res.status(400).send('Update not possible: ' + err.message);
				});
		}
	});
});

// @route DELETE api/User/delete/email
// @desc Delete a user by email
// @access Public
router.delete('/email/:email', function (req, res) {
	let user = req.params.email;

	User.findOneAndDelete({ email: user }, function (err, users) {
		if (err) res.status(404).send('User is not found');
		else res.status(200).json(users);
	});
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: 'Email already exists' });
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				level: 'User',
			});
			// Hash password before saving in database
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;
	// Find user by email
	User.findOne({ email }).then((user) => {
		// Check if user exists
		if (!user) {
			return res.status(404).json({ emailnotfound: 'Email not found' });
		}
		// Check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name,
					email: user.email,
					level: user.level,
				};
				// Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926, // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token,
						});
					}
				);
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: 'Password incorrect' });
			}
		});
	});
});

module.exports = router;
