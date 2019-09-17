import React from "react";
import { useStoreState } from "easy-peasy";
import Head from "next/head";
import Link from "next/link";
import Welcome from "./Welcome";
import EmptyState from "../components/EmptyState";

function Home() {
	const user = useStoreState(state => state.users.currentUser);

	if (user) {
		return (
			<>
				<Head>
					<title>Your Feed &mdash; Castaway</title>
				</Head>
				<EmptyState>
					<EmptyState.Heading>Your Feed: Coming Soon 🚧</EmptyState.Heading>
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
	}

	return <Welcome />;
}

export default Home;
