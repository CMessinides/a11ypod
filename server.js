require("dotenv").config();

const http = require("http");
const express = require("express");
const next = require("next");
const { isDev } = require("./core/env");
const { setupAuth } = require("./core/auth/setup");
const { setupGraphql } = require("./core/graphql/setup");

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	setupAuth(server);
	setupGraphql(server);

	server.get("*", handle);

	const port = process.env.PORT || 3000;
	http.createServer(server).listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
});
