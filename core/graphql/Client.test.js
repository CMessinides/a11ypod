import Client from "./Client";
import errors from "../errors";
import errorCode from "../errors/codes";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);

it("should format and send a GraphQL query", async () => {
	expect.assertions(2);

	// Set up a mock GraphQL response
	const query = "query { hello }";
	const data = { hello: "world!" };
	mockFetchResolve({ json: { data } });

	const response = await Client.query(query);

	expect(response).toBe(data);
	expect(fetch).toHaveBeenCalledWith(
		Client.ENDPOINT,
		expect.objectContaining({
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query
			})
		})
	);
});

it("should throw an error if fetch rejects", () => {
	mockFetchReject({ reason: new Error("failed to fetch") });

	expect(Client.query("query { anything }")).rejects.toBeInstanceOf(
		errors.NetworkError
	);
});

it.each([
	["NotFoundError", "404", 404],
	["UnauthenticatedError", "403", 403],
	["InternalServerError", "500", 500],
	["InternalServerError", "anything else", 418]
])("should throw %s when the response status is %s", (name, _, status) => {
	mockFetchResolve({ status });

	const errorType = errors[name];

	expect(Client.query("query { anything }")).rejects.toBeInstanceOf(errorType);
});

it.each([
	["NotFoundError", errorCode.NOT_FOUND],
	["UnauthenticatedError", errorCode.UNAUTHENTICATED],
	["InternalServerError", errorCode.INTERNAL_SERVER_ERROR],
	["InternalServerError", "unknown"]
])(
	"should throw %s when GraphQL returns an error with %s code",
	(name, code) => {
		const graphqlErrors = [
			{
				extensions: {
					code
				}
			}
		];
		mockFetchResolve({ json: { errors: graphqlErrors } });

		const errorType = errors[name];

		expect(Client.query("query { anything }")).rejects.toBeInstanceOf(
			errorType
		);
	}
);
