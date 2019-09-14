const { URLSearchParams } = require("url");
const fetch = require("isomorphic-unfetch");

const BASE_URL = "https://itunes.apple.com";

module.exports = {
	async search(term, { offset } = {}) {
		const params = new URLSearchParams(
			Object.assign(
				{
					term,
					entity: "podcast"
				},
				offset && offset > 0 && { offset }
			)
		);

		const url = BASE_URL + `/search?${params}`;
		const response = await (await fetch(url)).json();
		return response.results.map(result => {
			return {
				id: result.collectionId,
				title: result.collectionName,
				genre: result.primaryGenreName,
				publisher: {
					id: result.artistId,
					name: result.artistName
				},
				iTunesUrl: result.collectionViewUrl,
				feedUrl: result.feedUrl,
				thumbnail: {
					w30: result.artworkUrl30,
					w60: result.artworkUrl60,
					w100: result.artworkUrl100,
					w600: result.artworkUrl600
				}
			};
		});
	}
};
