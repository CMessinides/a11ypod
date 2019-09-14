const PodcastRepo = require("./PodcastRepo");

/**
 * Search the iTunes podcast library for a given term. An optional offset
 * may be provided for paginated results.
 * @param {object} parent - Parent provided by the GraphQL handler
 * @param {object} arguments - Arguments parsed by the GraphQL handler
 * @param {string} arguments.q - The search term
 * @param {number} [arguments.offset=0] - The offset
 */
function searchPodcasts(parent, { q, offset }) {
	return PodcastRepo.search(q, { offset });
}

module.exports = {
	searchPodcasts
};
