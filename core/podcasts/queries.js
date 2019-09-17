const PodcastRepo = require("./PodcastRepo");

/**
 * Search the iTunes podcast library for a given term. An optional offset
 * may be provided for paginated results.
 * @param {Object} parent - Parent provided by the GraphQL handler
 * @param {Object} arguments - Arguments parsed by the GraphQL handler
 * @param {string} arguments.q - The search term
 * @param {Object} arguments.params - The search parameters
 * @param {number} [arguments.params.offset] - The number of results to skip
 * @param {number} [arguments.params.limit] - The maximum number of results to return
 * @param {Object} context
 * @param {AbortSignal} [context.signal] - A signal to abort the search request
 */
function searchPodcasts(parent, { q, params }, { signal }) {
	return PodcastRepo.search(q, { ...params, signal });
}

module.exports = {
	searchPodcasts
};
