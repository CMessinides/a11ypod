import NetworkRequest from "./NetworkRequest";
import { NetworkError, ResponseError, InternalServerError } from "../errors";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);
mockFetchResolve({ once: false });

const url = "https://example.com";

it.each([["get"], ["put"], ["post"], ["delete"]])(
	"should %s() a URL",
	async method => {
		expect.assertions(1);

		await new NetworkRequest(url)[method]();
		expect(fetch).toHaveBeenLastCalledWith(
			url,
			expect.objectContaining({ method: method.toUpperCase() })
		);
	}
);

it("should allow custom configuration", async () => {
	expect.assertions(1);

	const config = {
		credentials: "include"
	};

	await new NetworkRequest(url).set(config).get();

	expect(fetch).toHaveBeenLastCalledWith(url, expect.objectContaining(config));
});

it("should forward same-site request cookies if provided", () => {
	// Mock a request with cookies we want to forward to another service on our
	// same site, like an API endpoint, but not to other sites.
	const req = {
		headers: {
			host: "example.com",
			cookie: "session=foobarbaz"
		}
	};

	// If we request a URL on the same site, the cookies should be forwarded.
	const sameSiteRequest = new NetworkRequest("https://example.com/api", {
		req
	});
	expect(sameSiteRequest.config.headers.Cookie).toBe(req.headers.cookie);

	// If we request a URL on a different site, the cookies should not be
	// forwarded.
	const diffSiteRequest = new NetworkRequest("https://google.com", { req });
	expect(diffSiteRequest.config.headers.Cookie).not.toBe(req.headers.cookie);
});

it("should fail if fetch throws an error", async () => {
	expect.assertions(3);

	mockFetchReject({ reason: new Error("Any old error") });

	const request = new NetworkRequest(url);
	const response = await request.get();

	// The request should mark itself as failed.
	expect(request.succeeded).toBe(false);
	expect(request.error).toBeInstanceOf(NetworkError);
	expect(response).toBe(null);
});

it("should fail if the response status is not OK", async () => {
	expect.assertions(4);

	mockFetchResolve({ status: 404 });

	const request = new NetworkRequest(url);
	const response = await request.get();

	// The request should mark itself as failed...
	expect(request.succeeded).toBe(false);
	expect(request.error).toBeInstanceOf(ResponseError);
	expect(request.error.extensions.response).toStrictEqual(response);
	// ...but the response should still be provided.
	expect(response).not.toBe(null);
});

it("should succeed if the response is OK", async () => {
	expect.assertions(3);
	mockFetchResolve();

	const request = new NetworkRequest(url);
	const response = await request.get();

	// The request should mark itself as successful.
	expect(request.succeeded).toBe(true);
	expect(request.error).toBe(null);
	expect(response).not.toBe(null);
});

it("should allow a custom strategy to determine success", async () => {
	expect.assertions(4);

	// Here's an example strategy that checks whether the JSON response contains
	// an errors field (e.g. in the case of a failed GraphQL request) and fails
	// the request if it does. Note that this strategy does not need to check
	// whether the response is not OK (`response.ok`) or, even more tedious,
	// whether fetch threw an error. The default NetworkRequest error handling
	// will still mark this request as failed in those cases; this strategy
	// is just another check on top of that. And inversely, if a strategy wants
	// to un-fail a request for some reason, that's possible, too.
	const strategy = {
		checkResponse: async (request, response) => {
			const { errors } = await response.json();
			if (errors && errors[0]) {
				request.fail(errors[0]);
			}
		}
	};

	// Tell the request to implement the strategy through the `use()` method
	const request = new NetworkRequest(url).use(strategy);

	// Mock a fetch response that fails the strategy.
	const error = { message: "I'm an error!" };
	mockFetchResolve({
		json: { errors: [error] }
	});
	await request.get();

	// The request should implement the strategy and mark itself failed.
	expect(request.succeeded).toBe(false);
	expect(request.error).toBe(error);

	// Now mock a fetch response that passes the strategy.
	const data = "No errors here!";
	mockFetchResolve({
		json: { data }
	});
	await request.get();

	// The request should now be successful
	expect(request.succeeded).toBe(true);
	expect(request.error).toBe(null);
});

it("should allow a custom strategy for processing errors", async () => {
	// Here's an example strategy that logs the actual error, then returns an
	// InternalServerError. This is useful in, say, a backend service where we
	// want to know what went wrong, but we don't want to expose those details
	// to the client.
	const fakeLog = () => {};
	const customError = new InternalServerError();
	const strategy = {
		onError: error => {
			fakeLog(error);
			return customError;
		}
	};

	// The error handler should be called if fetch throws an error
	mockFetchReject({ reason: new Error("Fetch failed") });
	const request = new NetworkRequest(url).use(strategy);
	await request.get();

	// Normally, request.error would just be an instance of NetworkError
	expect(request.error).toBe(customError);

	// Clear the error in preparation for the second part of the test
	request.succeed();

	// The error handler should also be called in the case of a bad response
	mockFetchResolve({ status: 404 });
	await request.get();

	// Normally, request.error would be an instance of ResponseError
	expect(request.error).toBe(customError);
});
