import React from "react";
import Welcome from "./Welcome";
import { useStoreState } from "easy-peasy";

function Home() {
	const user = useStoreState(state => state.users.currentUser);

	if (user) {
		return <div>You are logged in!</div>;
	}

	return <Welcome />;
}

export default Home;
