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
	search: thunk(async (actions, payload) => {
		const data = await fetchGraphql({
			body: JSON.stringify({
				query,
				variables: { term: payload.term }
			}),
			signal: payload.signal
		});

		actions.addBatch(data.searchPodcasts.results);
		return data.searchPodcasts;
	})
};

export default PodcastsModel;
