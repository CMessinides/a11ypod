import React from "react";
import PropTypes from "prop-types";
import EmptyState from "../components/EmptyState";
import LoginButton from "../auth/LoginButton";

function Playlist({ user }) {
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
					<LoginButton className="button--lg m-1">Get Started</LoginButton>
				</EmptyState.Actions>
			</EmptyState>
		);
	}
}

Playlist.propTypes = {
	user: PropTypes.object
};

export default Playlist;
