const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// model użytkownika
const User = require("../models/User");

router.get("/", (req, res) => {

	if (req.isAuthenticated()) {
		
		res.redirect("/panel");

	} else {

		res.render("start", {
        	title: "Opiekun prawny"
    	});

	}

});

// Logowanie
router.post("/", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/panel",
		failureRedirect: "/",
		failureFlash: true
	})(req, res, next);
});

// Wylogowanie
router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success_msg", "Zostałeś wylogowany");
	res.redirect("/");
});

module.exports = router;