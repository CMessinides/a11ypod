const config = require("./config");
const { isDev } = require("../env");

/**
 * Attach auth middleware and routes to the server
 * @param {Express.Application} server
 * @returns {Express.Application}
 */
function setupAuth(server) {
	// Set up in-memory session storage
	const session = require("express-session");
	const MemoryStore = require("memorystore")(session);
	const maxAge = 24 * 60 * 60 * 1000; // 24 hours

	// Attach the session middleware to the server
	server.use(
		session({
			cookie: {
				maxAge,
				sameSite: false,
				secure: !isDev
			},
			secret: config.COOKIE_SECRET,
			store: new MemoryStore({
				checkPeriod: maxAge
			}),
			resave: false,
			saveUninitialized: false
		})
	);

	// Set up authentication through Auth0
	const passport = require("passport");
	const Auth0Strategy = require("passport-auth0");
	passport.use(
		new Auth0Strategy(
			{
				domain: config.AUTH0_DOMAIN,
				clientID: config.AUTH0_CLIENT_ID,
				clientSecret: config.AUTH0_CLIENT_SECRET,
				callbackURL: config.AUTH0_CALLBACK_URL
			},
			(accesToken, refreshToken, extraParams, profile, done) => {
				done(null, profile);
			}
		)
	);

	// Attach Passport middleware to the server
	server.use(passport.initialize());
	server.use(passport.session());

	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	// attach the authentication routes to the server
	server.use(require("./routes"));

	return server;
}

module.exports = {
	setupAuth
};
