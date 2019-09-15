import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";
import Playlist from "./Playlist";

afterEach(cleanup);

it("should display an empty state if the user is not logged in", () => {
	const initialState = {
		users: {
			currentUser: null
		}
	};
	const { Container } = createStore({ initialState });
	const { getByText } = render(
		<Container>
			<Playlist />
		</Container>
	);

	// The page should render a login button
	const loginButton = getByText("Get Started");
	expect(loginButton).toBeInTheDocument();
	expect(loginButton).toHaveAttribute("href", "/login");
});
