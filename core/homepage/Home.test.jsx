import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";
import Home from "./Home";

afterEach(cleanup);

it("should display the landing page if the user is not logged in", () => {
	const initialState = {
		users: {
			currentUser: null
		}
	};
	const { Container } = createStore({ initialState });
	const { getByText } = render(
		<Container>
			<Home />
		</Container>
	);

	// A login button should be present
	const loginButton = getByText(/get started/i);
	expect(loginButton).toBeInTheDocument();
	expect(loginButton).toHaveAttribute("href", "/login");
});
