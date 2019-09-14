class InternalServerError extends Error {
	constructor() {
		super();
		this.name = "InternalServerError";
		this.code = "INTERNAL_SERVER_ERROR";
	}
}

module.exports = InternalServerError;
