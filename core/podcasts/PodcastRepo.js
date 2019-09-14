const { URLSearchParams } = require("url");
const fetch = require("isomorphic-unfetch");

const BASE_URL = "https://itunes.apple.com";

module.exports = {
	/**
	 * Search the iTunes podcast directory for a given search term.
	 * @param {string} term - The search term
	 * @param {Object} [options={}]
	 * @param {number} [options.offset] - The number of results to skip. Defaults to 0.
	 * @returns {Promise<Podcast[]>}
	 */
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

// Type definitions

/**
 * @typedef {Object} Podcast
 * @property {string} id - a unique ID provided by iTunes
 * @property {string} title
 * @property {string} genre
 * @property {string} iTunesUrl - a link to view the podcast on iTunes
 * @property {string} feedUrl - a link to the podcast's RSS feed
 * @property {Publisher} publisher
 * @property {Thumbnail} thumbnail
 */

/**
 * A podcast publisher with an optional ID
 * @typedef {Object} Publisher
 * @property {string} id - a unique ID provided by iTunes. If the publisher does not exist in the iTunes system, this will be undefined.
 * @property {string} name
 */

/**
 * Links to a thumbnail at four different resolutions
 * @typedef {Object} Thumbnail
 * @property {string} w30 - a link to the thhumbnail that is 30 pixels square
 * @property {string} w60 - a link to the thumbnail that is 60 pixels square
 * @property {string} w100 - a link to the thumbnail that is 100 pixels square
 * @property {string} w600 - a link to the thumbnail that is 600 pixels square
 */
