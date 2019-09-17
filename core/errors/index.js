const {
	NETWORK_ERROR,
	RESPONSE_ERROR,
	UNAUTHENTICATED,
	NOT_FOUND,
	INTERNAL_SERVER_ERROR,
	UNKNOWN_ERROR
} = require("./codes");

/**
 * Basis for all recognized errors in the application, both on the server and
 * on the client. You probably do not want to create instances of this class
 * directly. Instead, use the more meaningful errors that inherit from
 * BaseError:
 * - NetworkError
 * - UnauthenticatedError
 * - NotFoundError
 * - InternalServerError
 * - UnknownError
 */
class BaseError extends Error {
	/**
	 * @param {any} message
	 */
	constructor(message) {
		super(message ? message.toString() : "");
		this.name = "BaseError";
		this.extensions = {};
	}
}

/**
 * Represents a failure to connect to a critical network resource like an API
 * endpoint.
 */
class NetworkError extends BaseError {
	constructor(message) {
		super(message);
		this.name = "NetworkError";
		this.code = NETWORK_ERROR;
	}
}

/**
 * Represents a case where a network resource was reached, but it returned a
 * bad response.
 */
class ResponseError extends BaseError {
	/**
	 * @param {any} message
	 * @param {Object} info
	 * @param {Response} info.response - The bad response received
	 */
	constructor(message, { response } = {}) {
		super(message);
		this.name = "ResponseError";
		this.code = RESPONSE_ERROR;
		this.extensions.response = response;
	}
}

/**
 * Represents a refusal to complete a request due to inadequate user
 * authentication.
 */
class UnauthenticatedError extends BaseError {
	constructor(message) {
		super(message);
		this.name = "UnauthenticatedError";
		this.code = UNAUTHENTICATED;
	}
}

/**
 * Represents a failure to find a requested resource.
 */
class NotFoundError extends BaseError {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
		this.code = NOT_FOUND;
	}
}

/**
 * Represents an unspecified error encountered anywhere in the server.
 */
class InternalServerError extends BaseError {
	constructor(message) {
		super(message);
		this.name = "InternalServerError";
		this.code = INTERNAL_SERVER_ERROR;
	}
}

/**
 * Represents an unexpected and unrecognized error encountered anywhere in
 * the system. Use sparingly.
 */
class UnknownError extends BaseError {
	constructor(message) {
		super(message);
		this.name = "UnknownError";
		this.code = UNKNOWN_ERROR;
	}
}

module.exports = {
	BaseError,
	NetworkError,
	ResponseError,
	UnauthenticatedError,
	NotFoundError,
	InternalServerError,
	UnknownError
};
