import React from "react";
import Link from "next/link";
import Head from "next/head";
import LoginButton from "../auth/LoginButton";

export default function Welcome() {
	return (
		<>
			<Head>
				<title>Castaway &mdash; Your podcasts, organized.</title>
			</Head>
			<div className="h-full flex flex-col justify-center text-center max-w-2xl px-3 py-12 sm:px-6 mx-auto">
				<h1 className="text-3xl font-bold leading-tight">
					Your podcasts, organized.
				</h1>
				<p className="my-8 text-gray-700 text-lg">
					Castaway helps you manage your favorite podcasts. Subscribe to
					channels and save episodes to listen later.
				</p>
				<div className="flex flex-wrap justify-center -m-1">
					<LoginButton className="button--lg m-1">Get started</LoginButton>
					<Link href="/search">
						<a className="button button--secondary button--lg m-1">
							Browse podcasts
						</a>
					</Link>
				</div>
			</div>
		</>
	);
}
