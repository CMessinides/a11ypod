const fetch = require("isomorphic-unfetch");
const merge = require("lodash/merge");
const { NetworkError, ResponseError } = require("../errors");

class NetworkRequest {
	/**
	 * The default response handler for network requests. Called before any
	 * custom handlers registered through `use()`.
	 * @param {NetworkRequest} request
	 * @param {Response} response
	 */
	static async checkResponse(request, response) {
		if (!response.ok) {
			request.fail(new ResponseError(response.statusText, { response }));
		} else {
			request.succeed();
		}
	}
	/**
	 * Create a new network request for a URL
	 * @param {string} url
	 * @param {Object} [context={}]
	 * @param {Express.Request} [context.req] - The user request initiating this
	 * request. This should only be present on the server.
	 */
	constructor(url, { req } = {}) {
		this.url = url;
		/** @type {RequestInit} */
		this.config = {
			headers: {}
		};

		// Forward cookies from the initiating request if the request is same-site
		if (req && req.headers.host === new URL(this.url).host) {
			this.config.headers.Cookie = req.headers.cookie;
		}

		this.attempts = 0;
		this.succeeded = false;
		this.error = null;

		/**
		 * Holds any custom response handlers registered through `use()`.
		 * @type {ResponseHandler[]} */
		this.responseHandlers = [
			// Add the default response handler first
			NetworkRequest.checkResponse
		];

		/**
		 * Holds any custom error processors registered through `use()`.
		 * @type {ErrorProcessor[]} */
		this.errorProcessors = [];
	}

	/**
	 * Register a custom strategy with the request. Retunrs the
	 * NetworkRequest to allow chaining.
	 * @param {RequestStrategy} strategy
	 * @returns {NetworkRequest}
	 */
	use(strategy) {
		for (const key in strategy) {
			const handler = strategy[key];
			switch (key) {
				case "checkResponse":
					this.responseHandlers.push(handler);
					break;
				case "onError":
					this.errorProcessors.push(handler);
					break;
			}
		}

		return this;
	}

	/**
	 * Set configuration options for the network request. Returns the
	 * NetworkRequest to allow chaining
	 * @param {RequestInit} options - The configuration options
	 * @returns {NetworkRequest}
	 */
	set(options = {}) {
		this.config = merge(this.config, options);

		return this;
	}

	/**
	 * Put the request in a failed state. Returns the NetworkRequest to allow
	 * chaining.
	 * @param {Object} [reason] - An optional reason for failing the request.
	 * @returns {NetworkRequest}
	 */
	fail(reason) {
		this.succeeded = false;
		this.error = this.processError(reason);
		return this;
	}

	/**
	 * Put the request in a succeeded state. Returns the NetworkRequest to allow
	 * chaining.
	 * @returns {NetworkRequest}
	 */
	succeed() {
		this.succeeded = true;
		this.error = null;
		return this;
	}

	/**
	 * Send the request. This is probably not the method you want to use;
	 * instead, use one of the `get()`, `post()`, `put()`, or `delete()`
	 * convenience methods.
	 * @returns {Promise<Response>}
	 */
	async send() {
		// Reset the request state and add another attempt
		this.succeeded = false;
		this.error = null;
		this.attempts++;

		/** @type {Response} */
		let response;
		try {
			response = await fetch(this.url, this.config);
		} catch (e) {
			// Fail and return early if fetch errors
			this.fail(new NetworkError(e.message));
			return null;
		}

		// Check the response to fail or succeed
		await this.checkResponse(response);

		return response;
	}

	/**
	 * Send the request using the GET method
	 */
	get() {
		return this.set({ method: "GET" }).send();
	}

	/**
	 * Send the request using the PUT method
	 */
	put() {
		return this.set({ method: "PUT" }).send();
	}

	/**
	 * Send the request using the POST method
	 */
	post() {
		return this.set({ method: "POST" }).send();
	}

	/**
	 * Send the request using the DELETE method
	 */
	delete() {
		return this.set({ method: "DELETE" }).send();
	}

	/**
	 * Checks a response with any registered response handlers.
	 * @param {Response} response
	 */
	async checkResponse(response) {
		for (const handle of this.responseHandlers) {
			// We clone the response here every time so that each handler receives a
			// fresh response with readable body and methods like `text()`, `json()`,
			// and so on.
			await handle(this, response.clone());
		}
	}

	/**
	 * Process the error with any registered error processors and return the
	 * result.
	 * @param {Error} error
	 */
	processError(error) {
		for (const process of this.errorProcessors) {
			error = process(error);
		}

		return error;
	}

	/**
	 * Represents whether the request has been attempted at least
	 * once already.
	 */
	get attempted() {
		return this.attempts > 0;
	}
}

module.exports = NetworkRequest;

// Type definitions

/**
 * Defines a custom strategy for a NetworkRequest. Strategies can implement
 * any or all of the keys available.
 * @typedef {Object} RequestStrategy
 * @property {ResponseHandler} checkResponse - Called when the NetworkRequest
 * receives a response from fetch. This method is called after NetworkRequest
 * has already completed its default response handling. If fetch throws an
 * error, this method will not be called.
 * @property {ErrorProcessor} onError - Called when the NetworkRequest
 * encounters an error anywhere in its lifecycle. This method is responsible
 * for optionally transforming the error and returning it for assignment
 * to the NetworkRequest.
 */

/**
 * Validates the response and optionally marks the request as succeeded or
 * failed if certain conditions are met.
 * @typedef {(request: NetworkRequest, response: Response) => Promise<any>} ResponseHandler
 */

/**
 * Receives any error encountered by the request and optionally transforms it
 * before returning it to the request.
 * @typedef {(error: Error) => Error} ErrorProcessor
 */
