import React from "react";
import Link from "next/link";
import Head from "next/head";
import EmptyState from "../components/EmptyState";
import LoginButton from "../auth/LoginButton";

export default function Welcome() {
	return (
		<>
			<Head>
				<title>a11yPod &mdash; The accessible podcast app</title>
			</Head>
			<EmptyState>
				<EmptyState.Heading>a11yPod</EmptyState.Heading>
				<EmptyState.Blurb>
					a11yPod is a demo podcast app that prioritizes accessibility. Log in
					to your account or search podcasts right away.
				</EmptyState.Blurb>
				<EmptyState.Actions>
					<LoginButton className="button--lg">Get started</LoginButton>
					<Link href="/search">
						<a className="button button--secondary button--lg">
							Browse podcasts
						</a>
					</Link>
				</EmptyState.Actions>
			</EmptyState>
		</>
	);
}
