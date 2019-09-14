import PodcastRepo from "./PodcastRepo";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import searchNbaResults from "./__fixtures__/search-nba.json";
import searchNbaResultsWithOffset from "./__fixtures__/search-nba-w-offset.json";

describe("search", () => {
	it("should return podcasts matching the search term", async () => {
		expect.assertions(2);

		mockFetchOk(searchNbaResults);
		const results = await PodcastRepo.search("nba");

		expect(results).toMatchSnapshot();
		expect(fetch).toHaveBeenLastCalledWith(
			"https://itunes.apple.com/search?term=nba&entity=podcast"
		);
	});

	it("should accept an optional offset", async () => {
		expect.assertions(2);

		mockFetchOk(searchNbaResultsWithOffset);
		const results = await PodcastRepo.search("nba", { offset: 25 });

		expect(results).toMatchSnapshot();
		expect(fetch).toHaveBeenLastCalledWith(
			"https://itunes.apple.com/search?term=nba&entity=podcast&offset=25"
		);
	});
});

describe("find", () => {});

function mockFetchOk(json) {
	fetch.mockResolvedValueOnce({
		ok: true,
		json: () => Promise.resolve(json)
	});
}
