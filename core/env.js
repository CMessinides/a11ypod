const graphqlRoute = "/api/v1/graphql";

module.exports = {
	isDev: process.env.NODE_ENV !== "production",
	baseUrl: process.env.BASE_URL,
	graphqlEndpoint: process.env.BASE_URL
		? process.env.BASE_URL + graphqlRoute
		: graphqlRoute
};
