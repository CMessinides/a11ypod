const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { isDev } = require("../env");

/**
 * Configure the GraphQL server and mount it on the main server.
 * @param {Express.Application} server - The main application server
 * @param {object} [options]
 * @param {string} [options.endpoint="/api/v1/graphql"] - The route where the GraphQL API should be mounted
 */
function setupGraphql(server, { endpoint = "/api/v1/graphql" } = {}) {
	const graphqlServer = new ApolloServer({
		typeDefs,
		resolvers,
		playground: isDev,
		debug: !isDev
	});

	graphqlServer.applyMiddleware({ app: server, path: endpoint });

	return server;
}

module.exports = {
	setupGraphql
};
