import React from "react";
import { useStoreState } from "easy-peasy";
import Head from "next/head";
import Link from "next/link";
import EmptyState from "../components/EmptyState";
import LoginButton from "../auth/LoginButton";

function Playlist() {
	const user = useStoreState(state => state.users.currentUser);

	if (user) {
		return (
			<>
				<Head>
					<title>Your Playlist &mdash; Castaway</title>
				</Head>
				<EmptyState>
					<EmptyState.Heading>Your Playlist: Coming Soon 🚧</EmptyState.Heading>
					<EmptyState.Blurb>
						This feature is a work-in-progress.
					</EmptyState.Blurb>
					<EmptyState.Actions>
						<Link href="/search">
							<a className="button button--primary button--lg">Go to search</a>
						</Link>
					</EmptyState.Actions>
				</EmptyState>
			</>
		);
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
