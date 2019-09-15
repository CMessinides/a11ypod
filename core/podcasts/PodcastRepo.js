const { URLSearchParams } = require("url");
const NetworkRequest = require("../network/NetworkRequest");
const { InternalServerError } = require("../errors/");

const BASE_URL = "https://itunes.apple.com";

const itunesStrategy = {
	onError: error => new InternalServerError(error)
};

module.exports = {
	/**
	 * Search the iTunes podcast directory for a given search term.
	 * @param {string} term - The search term
	 * @param {Object} [options={}]
	 * @param {number} [options.offset=0] - The number of results to skip. Defaults to 0.
	 * @param {number} [options.limit=25] - The maximum number of results to return. Defaults to 25.
	 * @returns {Promise<PodcastSearchResults>}
	 */
	async search(term, { offset = 0, limit = 25 } = {}) {
		const params = new URLSearchParams(
			Object.assign(
				{
					term,
					entity: "podcast",
					// We add one to the desired limit here to allow us to "peek" at the next page of results.
					// If we don't receive `limit + 1` results in return, then we know there are no more results
					// and can tell the client not to request any more.
					limit: limit + 1
				},
				offset && offset > 0 && { offset }
			)
		);

		const url = BASE_URL + `/search?${params}`;
		const request = new NetworkRequest(url).use(itunesStrategy);
		const response = await request.get();
		if (!request.succeeded) throw request.error;
		const data = await response.json();

		// As noted above, if we did not receive limit + 1 results, then there
		// are no more results to fetch.
		const isEndOfResults = data.results.length !== limit + 1;
		// If we are *not* at the end of results, remove the last result from the list,
		// since we needed it only to peek at the next page.
		const results = !isEndOfResults ? data.results.slice(0, -1) : data.results;
		/** @type {PodcastSearchResults} */
		return {
			startIndex: offset,
			nextOffset: isEndOfResults ? null : limit + offset,
			results: results.map(result => {
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
			})
		};
	}
};

// Type definitions

/**
 * Represents a podcast in the iTunes directory
 * @typedef {Object} Podcast
 * @property {string} id - A unique ID provided by iTunes
 * @property {string} title
 * @property {string} genre
 * @property {string} iTunesUrl - A link to view the podcast on iTunes
 * @property {string} feedUrl - A link to the podcast's RSS feed
 * @property {Publisher} publisher
 * @property {Thumbnail} thumbnail
 */

/**
 * Represents a podcast publisher with an optional ID
 * @typedef {Object} Publisher
 * @property {string} id - A unique ID provided by iTunes. If the publisher does not exist in the iTunes system, this will be undefined.
 * @property {string} name
 */

/**
 * Represents a thumbnail at four different resolutions
 * @typedef {Object} Thumbnail
 * @property {string} w30 - A link to the thumbnail that is 30 pixels square
 * @property {string} w60 - A link to the thumbnail that is 60 pixels square
 * @property {string} w100 - A link to the thumbnail that is 100 pixels square
 * @property {string} w600 - A link to the thumbnail that is 600 pixels square
 */

/**
 * Represents the results of a podcast search
 * @typedef {Object} PodcastSearchResults
 * @property {number} startIndex - The index of the first result included. This is equivalent to the `offset` parameter passed to the iTunes search API.
 * @property {number} nextOffset - The offset to send for the next page of results. If there are no more results to fetch, this is set to null.
 * @property {Podcast[]} results - The podcasts returned by the search
 */
