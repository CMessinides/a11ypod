const graphqlRoute = "/api/v1/graphql";

module.exports = {
	isDev: process.env.NODE_ENV !== "production",
	baseUrl: process.env.BASE_URL,
	graphqlEndpoint: this.baseUrl ? this.baseUrl + graphqlRoute : graphqlRoute
};
