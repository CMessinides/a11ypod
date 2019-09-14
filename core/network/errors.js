class NetworkError extends Error {
	constructor(message) {
		super(message);
		this.name = "NetworkError";
		this.code = "NETWORK_ERROR";
	}
}

class ResponseError extends Error {
	constructor(message, { status } = {}) {
		super(message);
		this.code = "RESPONSE_ERROR";
		this.extensions = {
			status
		};
	}
}

module.exports = {
	NetworkError,
	ResponseError
};
