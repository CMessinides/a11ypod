import React from "react";
import PropTypes from "prop-types";
import Welcome from "./Welcome";

function Home({ user }) {
	if (user) {
		return <div>You are logged in!</div>;
	}

	return <Welcome />;
}

Home.propTypes = {
	user: PropTypes.object
};

export default Home;
