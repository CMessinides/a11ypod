import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserMenu from "./UserMenu";

afterEach(cleanup);

const user = {
	name: {
		givenName: "Cameron"
	},
	displayName: "Cameron",
	picture: "https://img.users.com/cameron.jpg"
};

it("should default to a closed state", () => {
	const { getByTestId, container } = render(<UserMenu user={user} />);

	// The component should render a toggle button
	const toggleButton = getByTestId("menu-toggle");
	// The toggle should be in an unexpanded state
	expect(toggleButton).toHaveAttribute("aria-expanded", "false");

	// The toggle should be associated with the menu via the aria-controls attribute
	const menu = container.querySelector(
		"#" + toggleButton.getAttribute("aria-controls")
	);
	// The menu should be in the document, but hidden
	expect(menu).toBeInTheDocument();
	expect(menu).toHaveClass("hidden");

	// The first (and only) child of the toggle button should be the user's profile image
	expect(toggleButton.childElementCount).toBe(1);
	const profileImg = toggleButton.firstChild;
	expect(profileImg).toHaveAttribute("src", user.picture);
	// The profile image should provide an accessible name for the toggle button
	expect(profileImg).toHaveAttribute("alt", "Open user navigation");
});

it("should open or close when the toggle is clicked", () => {
	const { toggleButton, menu } = renderUserMenu();

	// Click once to open the menu
	fireEvent.click(toggleButton);

	// The menu should be open
	assertOpen({ toggleButton, menu });

	// Click again to close the menu
	fireEvent.click(toggleButton);

	// The menu should be closed
	assertClosed({ toggleButton, menu });
});

it("should close when focus leaves the menu", () => {
	const { toggleButton, menu, container } = renderUserMenu();

	// Click to open the menu
	fireEvent.click(toggleButton);
	// Move focus outside the component
	fireEvent.blur(container.firstChild);
	document.body.focus();

	// The menu should be closed
	assertClosed({ toggleButton, menu });
});

it("should close and focus on the toggle when the user hits Escape", () => {
	const { toggleButton, menu } = renderUserMenu();

	// Click to open the menu
	fireEvent.click(toggleButton);
	// Move focus to within the menu
	menu.querySelector("a").focus();
	// Hit the Escape key
	fireEvent.keyUp(document.activeElement, { key: "Escape" });

	// The menu should be closed
	assertClosed({ toggleButton, menu });
	// The toggle should be focused
	expect(toggleButton).toHaveFocus();
});

function renderUserMenu() {
	const { getByTestId, container } = render(<UserMenu user={user} />);

	const toggleButton = getByTestId("menu-toggle");
	const menu = container.querySelector(
		"#" + toggleButton.getAttribute("aria-controls")
	);

	return {
		container,
		toggleButton,
		menu
	};
}

function assertOpen({ toggleButton, menu }) {
	expect(toggleButton).toHaveAttribute("aria-expanded", "true");
	expect(menu).not.toHaveClass("hidden");
}

function assertClosed({ toggleButton, menu }) {
	expect(toggleButton).toHaveAttribute("aria-expanded", "false");
	expect(menu).toHaveClass("hidden");
}
