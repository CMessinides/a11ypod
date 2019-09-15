const NetworkRequest = require("../network/NetworkRequest");
const { BASE_URL } = require("../env");
const errorCode = require("../errors/codes");
const {
	ResponseError,
	UnauthenticatedError,
	NotFoundError,
	InternalServerError
} = require("../errors");

const ENDPOINT = BASE_URL + "/api/v1/graphql";

/**
 * Normalize an error returned by the GraphQL service.
 * @param {object} error
 * @param {string} error.message
 * @param {object} error.extensions
 * @param {string} error.extendsions.code
 */
function marshalGraphqlError(error) {
	switch (error.extensions.code) {
		case errorCode.UNAUTHENTICATED:
			return new UnauthenticatedError(error.message);
		case errorCode.NOT_FOUND:
			return new NotFoundError(error.message);
		default:
			return new InternalServerError(error.message);
	}
}

/**
 * Normalize a generic ResponseError.
 * @param {ResponseError} error
 */
function marshalResponseError(error) {
	switch (error.extensions.response.status) {
		case 403:
			return new UnauthenticatedError(error.message);
		case 404:
			return new NotFoundError(error.message);
		default:
			return new InternalServerError(error.message);
	}
}

/** @type {NetworkRequest.RequestStrategy} */
const graphqlStrategy = {
	async checkResponse(request, response) {
		let errors;
		try {
			({ errors } = await response.json());
		} catch (e) {
			// If the JSON parse fails for any reason, mask the error as a
			// server error.
			return request.fail(new InternalServerError(e));
		}

		// Even if the response is OK, the GraphQL service can still respond with
		// an errors field. If it's present, fail the request.
		if (errors && errors[0]) {
			request.fail(marshalGraphqlError(errors[0]));
		}
	},
	onError(error) {
		if (error instanceof ResponseError) {
			return marshalResponseError(error);
		}

		return error;
	}
};

const GraphqlClient = {
	get ENDPOINT() {
		return ENDPOINT;
	},
	/**
	 * Sends a GraphQL query to the API endpoint and returns the response
	 * @param {string} query The GraphQL query to execute
	 * @param {Object} context
	 * @param {Express.Request} context.req
	 * @param {Express.Response} context.res
	 * @param {RequestInit} context.config Additional options for the network
	 * request. Note that the 'Accept: application/json' and 'Content-Type:
	 * application/json' headers will always be set and cannot be overridden.
	 * @returns {Promise<Object>}
	 */
	async query(query, { req, config } = {}) {
		// Configure the request for a GraphQL
		const request = new NetworkRequest(ENDPOINT, { req })
			.use(graphqlStrategy)
			.set(config)
			.set({
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ query })
			});

		const response = await request.post();

		if (request.error) throw request.error;

		const { data } = await response.json();
		return data;
	}
};

module.exports = GraphqlClient;
