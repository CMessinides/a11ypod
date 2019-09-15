import React from "react";
import EmptyState from "../components/EmptyState";
import LoginButton from "../auth/LoginButton";
import { useStoreState } from "easy-peasy";

function Playlist() {
	const user = useStoreState(state => state.users.currentUser);

	if (user) {
		return <div>This is your list!</div>;
	} else {
		return (
			<EmptyState>
				<EmptyState.Heading>Your List</EmptyState.Heading>
				<EmptyState.Blurb>
					Saved episodes will appear here. Log in or create an account to get
					started.
				</EmptyState.Blurb>
				<EmptyState.Actions>
					<LoginButton className="button--lg">Get Started</LoginButton>
				</EmptyState.Actions>
			</EmptyState>
		);
	}
}

export default Playlist;
