require("dotenv").config();
const withCss = require("@zeit/next-css");

module.exports = withCss({
	webpack: (config, { webpack }) => {
		config.plugins.push(new webpack.EnvironmentPlugin(["BASE_URL"]));
		return config;
	}
});
