import GraphqlClient from "../graphql/Client";
import searchQuery from "./SearchQuery.graphql";
import { thunk } from "easy-peasy";

const PodcastsModel = {
	search: thunk(async (actions, payload) => {
		console.log("inside the search thunk!");
		try {
			const data = await GraphqlClient.query(searchQuery, {
				variables: payload.variables,
				config: {
					signal: payload.signal
				}
			});

			console.log("got data inside search thunk!", data);
			return data.searchPodcasts;
		} catch (e) {
			console.log("error inside search thunk", e);
			throw e;
		}
	})
};

export default PodcastsModel;
