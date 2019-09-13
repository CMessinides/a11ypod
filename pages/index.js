import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

const Home = ({ user }) => (
	<>
		<Head>
			<title>Home</title>
		</Head>
		<div>Hello world!</div>
		<p>You are {!user && "not"} logged in.</p>
	</>
);

Home.propTypes = {
	user: PropTypes.object
};

export default Home;
