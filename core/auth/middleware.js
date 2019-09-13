/**
 * Check for any unauthenticated requests and redirect them to the login page
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {() => void} next
 * @returns {void}
 */
function protectPage(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect("/login");
}

/**
 * Check for any unauthenticated
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {() => void} next
 * @returns {void}
 */
function protectEndpoint(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.status(403).send({ error: "Request is unauthenticated." });
}

module.exports = {
	protectPage,
	protectEndpoint
};
