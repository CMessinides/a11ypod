import React from "react";
import NextApp from "next/app";
import NavBar from "../core/nav/Navbar";
import { getOrCreateStore } from "../core/store";
import { StoreProvider } from "easy-peasy";

import "../core/styles/index.css";

class App extends NextApp {
	static async getInitialProps({ ctx, Component }) {
		ctx.store = getOrCreateStore();

		if (ctx.req && ctx.req.isAuthenticated()) {
			const { user } = ctx.req;
			const { users } = ctx.store.getActions();
			ctx.store.dispatch(
				users.login({
					id: user.id,
					picture: user.picture,
					name: user.name.givenName || user.displayName
				})
			);
		}

		const pageProps = await super.getInitialProps({ ctx, Component });

		return {
			...pageProps,
			initialState: ctx.store.getState()
		};
	}

	constructor(props) {
		super(props);
		this.store = getOrCreateStore(props.initialState);
	}

	render() {
		const { Component, pageProps } = this.props;
		return (
			<StoreProvider store={this.store}>
				<div className="h-full flex flex-col">
					<NavBar />
					<main id="main" className="flex-grow">
						<Component {...pageProps} />
					</main>
				</div>
			</StoreProvider>
		);
	}
}

export default App;
