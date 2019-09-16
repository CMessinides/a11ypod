import PodcastsModel from "./PodcastsModel";
import { createStore as createEasyPeasyStore } from "easy-peasy";

jest.mock("../graphql/Client");
import GraphqlClient from "../graphql/Client";
import mockSearchResults from "./__fixtures__/gql-search-podcasts.json";
import searchQuery from "./SearchQuery.graphql";

function createStore() {
	return createEasyPeasyStore({
		podcasts: PodcastsModel
	});
}

describe("search", () => {
	it("should query the GraphQL endpoint and return the results", async () => {
		expect.assertions(2);

		const { data } = mockSearchResults;
		GraphqlClient.query.mockResolvedValueOnce(data);
		const store = createStore();
		const actions = store.getActions();

		const response = await actions.podcasts.search({
			variables: { term: "vox" }
		});

		expect(response).toBe(data.searchPodcasts);
		expect(GraphqlClient.query).toHaveBeenLastCalledWith(
			searchQuery,
			expect.objectContaining({
				variables: {
					term: "vox"
				}
			})
		);
	});
});
