require("dotenv").config();
require("isomorphic-fetch");
const withCss = require("@zeit/next-css");

module.exports = withCss({
	webpack: (config, { webpack }) => {
		config.plugins.push(new webpack.EnvironmentPlugin(["API_URL"]));
		return config;
	}
});
