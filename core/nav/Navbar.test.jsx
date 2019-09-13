import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Navbar from "./Navbar";

jest.mock("next/router");
import { useRouter } from "next/router";
useRouter.mockReturnValue({
	pathname: "/"
});

afterEach(cleanup);

it("should display a login link if the user is not logged in", () => {
	const { getByText } = render(<Navbar user={null} />);

	const loginLink = getByText(/Log In/i);
	expect(loginLink).toHaveAttribute("href", "/login");
});

it("should display the user menu if the user is logged in", () => {
	const user = {
		name: {
			givenName: "Cameron"
		},
		picture: "https://img.users.com/cameron.jpg"
	};
	const { getByTestId } = render(<Navbar user={user} />);

	const userMenu = getByTestId("user-menu");
	expect(userMenu).toBeInTheDocument();
});
