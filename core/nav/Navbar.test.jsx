import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";
import Navbar from "./Navbar";

jest.mock("next/router");
import { useRouter } from "next/router";
useRouter.mockReturnValue({
	pathname: "/"
});

afterEach(cleanup);

it("should display a login link if the user is not logged in", () => {
	const initialState = {
		users: { currentUser: null }
	};
	const { Container } = createStore({ initialState });
	const { getByText } = render(
		<Container>
			<Navbar />
		</Container>
	);

	const loginLink = getByText(/Log In/i);
	expect(loginLink).toHaveAttribute("href", "/login");
});

it("should display the user menu if the user is logged in", () => {
	const initialState = {
		users: {
			currentUser: {
				id: "user123",
				name: "Cameron",
				picture: "https://img.users.com/cameron.jpg"
			}
		}
	};
	const { Container } = createStore({ initialState });
	const { getByTestId } = render(
		<Container>
			<Navbar />
		</Container>
	);

	const userMenu = getByTestId("user-menu");
	expect(userMenu).toBeInTheDocument();
});
