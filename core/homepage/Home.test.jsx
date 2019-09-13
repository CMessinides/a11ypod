import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "./Home";

afterEach(cleanup);

it("should display the landing page if the user is not logged in", () => {
	const { getByText } = render(<Home user={null} />);

	// A login button should be present
	const loginButton = getByText(/get started/i);
	expect(loginButton).toBeInTheDocument();
	expect(loginButton).toHaveAttribute("href", "/login");
});
