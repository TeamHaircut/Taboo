const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Select Room Page
router.get('/selectroom', ensureAuthenticated, (req, res) =>
  res.render('selectroom', {
    user: req.user
  })
);

// CAH App Page
router.get('/taboo', ensureAuthenticated, (req, res) =>
{res.render('taboo', { user: req.user}); /*console.log(req);*/}
);

// Select Room
router.post('/selectroom', (req, res) => {
	const { name, room } = req.body;
	let errors = [];
	
	if (!name) {
		errors.push({ msg: 'Please enter a username' });
	}
	
	if (errors.length > 0) {
		res.render('selectroom', {
			errors,
			user: req.user
		});
	} else {
	User.findOne({ email: req.user.email }).then(user => {
		if (user) {
			user.last_room = room.toUpperCase();
			console.log(user.last_room);
			user.name = name;
			user.save();
			res.redirect('/taboo');
		}
	});//end User findOne
  }	
});//end router.post

module.exports = router;
