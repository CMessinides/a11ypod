import React from "react";
import NextApp from "next/app";
import NavBar from "../core/nav/Navbar";

import "../core/styles/index.css";

class App extends NextApp {
	static async getInitialProps({ ctx, Component }) {
		const initialProps = await super.getInitialProps({ ctx, Component });
		if (ctx.req && ctx.req.isAuthenticated()) {
			// With more time, I would transform the raw user data from Auth0
			// into a flat object with only the attriutes needed by this app:
			// name, id, and profile picture. But for our purposes, this works
			// just fine.
			initialProps.user = ctx.req.user;
		}
		return initialProps;
	}

	constructor(props) {
		super(props);
		this.state = {
			user: props.user
		};
	}

	render() {
		const { Component, ...otherProps } = this.props;
		return (
			<div>
				<NavBar user={this.state.user} />
				<div>
					<Component {...otherProps} user={this.state.user} />
				</div>
			</div>
		);
	}
}

export default App;
