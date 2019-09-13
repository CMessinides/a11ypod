import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Playlist from "./Playlist";

afterEach(cleanup);

it("should display an empty state if the user is not logged in", () => {
	const { getByText } = render(<Playlist user={null} />);

	// The page should render a login button
	const loginButton = getByText("Get Started");
	expect(loginButton).toBeInTheDocument();
	expect(loginButton).toHaveAttribute("href", "/login");
});
