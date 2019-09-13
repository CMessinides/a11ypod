import React from "react";
import Link from "next/link";
import Head from "next/head";
import EmptyState from "../components/EmptyState";
import LoginButton from "../auth/LoginButton";

export default function Welcome() {
	return (
		<>
			<Head>
				<title>Castaway &mdash; Your podcasts, organized.</title>
			</Head>
			<EmptyState>
				<EmptyState.Heading>Your podcasts, organized.</EmptyState.Heading>
				<EmptyState.Blurb>
					Castaway helps you manage your favorite podcasts. Subscribe to
					channels and save episodes to listen later.
				</EmptyState.Blurb>
				<EmptyState.Actions>
					<LoginButton className="button--lg m-1">Get started</LoginButton>
					<Link href="/search">
						<a className="button button--secondary button--lg m-1">
							Browse podcasts
						</a>
					</Link>
				</EmptyState.Actions>
			</EmptyState>
		</>
	);
}
