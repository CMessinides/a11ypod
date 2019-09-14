const fs = require("fs");
const path = require("path");
const { gql } = require("apollo-server-express");

/**
 * Import GraphQL definition files (`*.graphql`) as plain text.
 *
 * **WARNING**: This method uses `fs.readFileSync`, which is a blocking
 * operation. Minimize its use and call only at server startup.
 * @param {string} filename - The path to the GraphQL file
 */
function requireGraphql(filename) {
	return fs.readFileSync(path.resolve(__dirname, filename), "utf8");
}

const Podcast = requireGraphql("../podcasts/Podcast.graphql");
const Publisher = requireGraphql("../podcasts/Publisher.graphql");
const Thumbnail = requireGraphql("../podcasts/Thumbnail.graphql");
const Query = requireGraphql("./Query.graphql");

module.exports = gql`
	${Podcast}
	${Publisher}
	${Thumbnail}

	${Query}
`;
