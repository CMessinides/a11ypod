import PodcastsModel from "./PodcastsModel";
import { createStore as createEasyPeasyStore } from "easy-peasy";
import { graphqlEndpoint } from "../env";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve } = createFetchMocks(fetch);

import apiResponse from "./__fixtures__/gql-search-podcasts.json";

// eslint-disable-next-line no-unused-vars
function createStore() {
	return createEasyPeasyStore({
		podcasts: PodcastsModel
	});
}

afterEach(fetch.mockClear);

describe("search", () => {
	it("should query the GraphQL endpoint and return the results", async () => {
		expect.assertions(2);

		mockFetchResolve({ json: apiResponse });
		const store = createStore();

		const results = await store.getActions().podcasts.search({ term: "vox" });
		expect(results).toMatchSnapshot();
		expect(fetch).toHaveBeenCalledWith(
			graphqlEndpoint,
			expect.objectContaining({
				body: expect.stringContaining(`"term":"vox"`)
			})
		);
	});

	it("should update the store with the response", async () => {
		expect.assertions(1);

		mockFetchResolve({ json: apiResponse });
		const store = createStore();

		await store.getActions().podcasts.search({ term: "vox" });

		expect(store.getState().podcasts.items).toMatchSnapshot();
	});
});
