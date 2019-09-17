import PodcastRepo from "./PodcastRepo";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve } = createFetchMocks(fetch);

import searchNbaResults from "./__fixtures__/search-nba.json";
import searchNbaResultsWithOffset from "./__fixtures__/search-nba-w-offset.json";
import searchNbaResultsLimit11 from "./__fixtures__/search-nba-limit-11.json";

jest.useFakeTimers();

afterEach(() => {
	fetch.mockReset();
	PodcastRepo.clearCache();
});

describe("search", () => {
	it("should return podcasts matching the search term", async () => {
		expect.assertions(2);

		mockFetchResolve({ json: searchNbaResults });
		const search = await PodcastRepo.search("nba");

		expect(search).toMatchSnapshot();
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining(
				"https://itunes.apple.com/search?term=nba&entity=podcast"
			),
			expect.anything()
		);
	});

	it("should accept an optional offset", async () => {
		expect.assertions(2);

		mockFetchResolve({ json: searchNbaResultsWithOffset });
		const search = await PodcastRepo.search("nba", { offset: 25 });

		expect(search.startIndex).toBe(25);
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("offset=25"),
			expect.anything()
		);
	});

	it("should return the next offset if there are more results", async () => {
		expect.assertions(2);

		// We mock a response with 11 results...
		mockFetchResolve({ json: searchNbaResultsLimit11 });
		// ...but ask for only 10.
		const search = await PodcastRepo.search("nba", { limit: 10 });

		// Therefore, results.nextOffset should be set to 10, i.e. the index of the first
		// result on the next page.
		expect(search.nextOffset).toBe(10);
		// And lastly, we should only get 10 results back, because we only asked for 10.
		expect(search.results.length).toBe(10);
	});

	it("should set the next offset to null if there are no more results", async () => {
		expect.assertions(2);

		// We again mock a response with 11 results...
		mockFetchResolve({ json: searchNbaResultsLimit11 });
		// ...but this time we ask for more.
		const search = await PodcastRepo.search("nba", { limit: 15 });

		// Therefore, results.nextOffset should be set to null to indicate that there are
		// no more pages of results.
		expect(search.nextOffset).toBe(null);
		expect(search.results.length).toBe(11);
	});

	it("should cache search results", async () => {
		// iTunes will stop serving results if we ping their API too often, and the
		// autosearch feature on the client can cause those requests to skyrocket.
		// Therefore, to mitigate annoying and unpredictable errors on the front-
		// end, we need to cache results for equivalent queries (same term, limit,
		// and offset).
		expect.assertions(4);

		mockFetchResolve({ json: searchNbaResults, once: false });

		// The first call should result in a cache miss and a network request
		await PodcastRepo.search("nba");
		expect(fetch).toHaveBeenCalled();

		// Reset the fetch call history
		fetch.mockClear();

		// The same search query should now result in a cache hit and no network
		// request.
		await PodcastRepo.search("nba");
		expect(fetch).not.toHaveBeenCalled();

		// Limit and offset parameters should be part of the query comparison,
		// meaning this call should result in a cache miss...
		await PodcastRepo.search("nba", { limit: 25, offset: 50 });
		expect(fetch).toHaveBeenCalled();

		fetch.mockClear();

		// ...and this call should hit the cache.
		await PodcastRepo.search("nba", { limit: 25, offset: 50 });
		expect(fetch).not.toHaveBeenCalled();
	});
});

describe("find", () => {});
