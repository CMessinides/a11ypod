import { fetchGraphql } from "../graphql/client";
import query from "./SearchQuery.graphql";
import { action, thunk } from "easy-peasy";

const PodcastsModel = {
	items: {},
	addBatch: action((state, payload) => {
		for (const podcast of payload) {
			state.items[podcast.id] = podcast;
		}
	}),
	search: thunk(async (actions, { term, offset = 0, signal } = {}) => {
		const data = await fetchGraphql({
			body: JSON.stringify({
				query,
				variables: { term, offset }
			}),
			signal
		});

		actions.addBatch(data.searchPodcasts.results);
		return data.searchPodcasts;
	})
};

export default PodcastsModel;
