const express = require("express");
const passport = require("passport");
const config = require("./config");
const { baseUrl } = require("../env");

const authRoutes = express.Router();

authRoutes.get(
	"/login",
	passport.authenticate("auth0", {
		scope: "openid email profile"
	}),
	(req, res) => res.redirect("/")
);

authRoutes.get("/callback", (req, res, next) => {
	passport.authenticate("auth0", (err, user, info) => {
		console.log({ err, user, info });
		if (err) return next(err);
		if (!user) return res.redirect("/login");
		req.logIn(user, err => {
			if (err) return next(err);
			res.redirect("/");
		});
	})(req, res, next);
});

authRoutes.get("/logout", (req, res) => {
	req.logout();

	const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = config;
	res.redirect(
		`https://${AUTH0_DOMAIN}/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${baseUrl}`
	);
});

module.exports = authRoutes;
