const { URLSearchParams } = require("url");
const fetch = require("isomorphic-unfetch");
const AbortController = require("abort-controller");
const LRU = require("lru-cache");
const { InternalServerError } = require("../errors/");

const BASE_URL = "https://itunes.apple.com";

function createRequest(url, { signal: externalSignal }) {
	const abortController = new AbortController();
	const { signal } = abortController;

	if (externalSignal) {
		externalSignal.addEventListener("abort", () => {
			abortController.abort();
		});
	}

	let shouldErrorOnAbort = false;
	return async function() {
		setTimeout(() => {
			shouldErrorOnAbort = true;
			abortController.abort();
		}, 3000);

		try {
			return await (await fetch(url, { signal })).json();
		} catch (e) {
			if (e.name === "AbortError") {
				if (!shouldErrorOnAbort) return;
			}
			throw new InternalServerError(e);
		}
	};
}

const cache = new LRU({
	max: 1000,
	length: ({ results }) => results.length,
	maxAge: 1000 * 60 * 60
});

module.exports = {
	/**
	 * Search the iTunes podcast directory for a given search term.
	 * @param {string} term - The search term
	 * @param {Object} [options={}]
	 * @param {number} [options.offset=0] - The number of results to skip. Defaults to 0.
	 * @param {number} [options.limit=25] - The maximum number of results to return. Defaults to 25.
	 * @param {AbortSignal} [options.signal] - A signal to abort the request to the iTunes API
	 * @returns {Promise<PodcastSearchResults>}
	 */
	async search(term, { signal, offset = 0, limit = 25 } = {}) {
		// First, check the cache for equivalent results and return early if they exist
		const cacheKey = [term, offset, limit].join("");
		if (cache.has(cacheKey)) {
			return cache.get(cacheKey);
		}

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
		const fetchResults = createRequest(url, { signal });
		const data = await fetchResults();

		// As noted above, if we did not receive limit + 1 results, then there
		// are no more results to fetch.
		const isEndOfResults = data.results.length !== limit + 1;
		// If we are *not* at the end of results, remove the last result from the list,
		// since we needed it only to peek at the next page.
		const results = !isEndOfResults ? data.results.slice(0, -1) : data.results;
		/** @type {PodcastSearchResults} */
		const response = {
			term,
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
						_30w: result.artworkUrl30,
						_60w: result.artworkUrl60,
						_100w: result.artworkUrl100,
						_600w: result.artworkUrl600
					}
				};
			})
		};

		cache.set(cacheKey, response);
		return response;
	},
	/**
	 * Clear the repo's internal cache of search results from the iTunes API.
	 */
	clearCache() {
		cache.reset();
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
 * @property {string} _30w - A link to the thumbnail that is 30 pixels square
 * @property {string} _60w - A link to the thumbnail that is 60 pixels square
 * @property {string} _100w - A link to the thumbnail that is 100 pixels square
 * @property {string} _600w - A link to the thumbnail that is 600 pixels square
 */

/**
 * Represents the results of a podcast search
 * @typedef {Object} PodcastSearchResults
 * @property {string} term The search term submitted in the request for the results.
 * @property {number} startIndex The index of the first result included. This is equivalent to the `offset` parameter passed to the iTunes search API.
 * @property {number} nextOffset The offset to send for the next page of results. If there are no more results to fetch, this is set to null.
 * @property {Podcast[]} results The podcasts returned by the search
 */
