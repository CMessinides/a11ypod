import PodcastsModel from "./PodcastsModel";
import { createStore as createEasyPeasyStore } from "easy-peasy";

// eslint-disable-next-line no-unused-vars
function createStore() {
	return createEasyPeasyStore({
		podcasts: PodcastsModel
	});
}

describe("search", () => {
	it("should query the GraphQL endpoint and return the results", () => {});
});
