import { fetchGraphql } from "./client";
import { graphqlEndpoint } from "../env";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);

afterEach(fetch.mockClear);

it("should request and return data from the GraphQL endpoint", async () => {
	expect.assertions(2);

	// Mock fetch to resolve with data for a GraphQL query
	const response = { data: { hello: "world" } };
	mockFetchResolve({ json: response });

	// Send the query
	const query = `query { hello }`;
	const body = JSON.stringify({ query });
	const data = await fetchGraphql({ body });

	expect(fetch).toHaveBeenCalledWith(
		graphqlEndpoint,
		expect.objectContaining({
			body,
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		})
	);
	expect(data).toBe(response.data);
});

it("should throw when the GraphQL endpoint returns an error", () => {
	// Mock fetch to resolve with errors in the GraphQL response
	mockFetchResolve({
		json: {
			data: null,
			errors: [
				{
					message: "Database crashed",
					extensions: { code: "INTERNAL_SERVER_ERROR" }
				}
			]
		}
	});
	return expect(fetchGraphql()).rejects.toThrow(
		"INTERNAL_SERVER_ERROR: Database crashed"
	);
});

it("should throw when fetch errors", () => {
	const error = new Error("fetch failed");
	mockFetchReject({ reason: error });
	return expect(fetchGraphql()).rejects.toThrow(error);
});

it("should not throw when the fetch is aborted", () => {
	mockFetchReject({ reason: { name: "AbortError" } });
	return expect(fetchGraphql()).resolves.toBeUndefined();
});
