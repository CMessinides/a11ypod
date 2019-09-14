import PodcastRepo from "./PodcastRepo";
import InternalServerError from "../errors/InternalServerError";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);

import searchNbaResults from "./__fixtures__/search-nba.json";
import searchNbaResultsWithOffset from "./__fixtures__/search-nba-w-offset.json";
import searchNbaResultsLimit11 from "./__fixtures__/search-nba-limit-11.json";

describe("search", () => {
	it("should return podcasts matching the search term", async () => {
		expect.assertions(2);

		mockFetchResolve({ json: searchNbaResults });
		const search = await PodcastRepo.search("nba");

		expect(search).toMatchSnapshot();
		expect(fetch).toHaveBeenLastCalledWith(
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
		expect(fetch).toHaveBeenLastCalledWith(
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

	it("should throw if the network request fails", () => {
		mockFetchReject();
		expect(PodcastRepo.search("nba")).rejects.toBeInstanceOf(
			InternalServerError
		);

		mockFetchResolve({
			status: 404,
			statusText: "Not Found"
		});
		expect(PodcastRepo.search("nba")).rejects.toBeInstanceOf(
			InternalServerError
		);
	});
});

describe("find", () => {});
