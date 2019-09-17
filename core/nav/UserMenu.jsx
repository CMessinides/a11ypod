import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function UserMenu({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggleEl = useRef(null);

	// This event handler toggles the user nav menu open or closed when the user
	// clicks its toggle button.
	const onToggleClick = () => {
		setIsOpen(isOpen => !isOpen);
	};

	// This event handler closes the user nav menu when the user presses
	// the Esc key while focus is within the menu. Because focus could be
	// lost when the menu disappears, this handler also returns focus to
	// the toggle.
	const onMenuKeyUp = e => {
		if (e.key === "Escape") {
			setIsOpen(false);
			toggleEl.current && toggleEl.current.focus();
		}
	};

	// This event handler tracks when focus leaves any of the elements within
	// the menu, and if the focus has moved to an element outside of the menu,
	// it closes the menu.
	const onMenuBlur = e => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setIsOpen(false);
		}
	};

	return (
		<nav
			aria-label="User navigation"
			className="relative"
			onKeyUp={onMenuKeyUp}
			onBlur={onMenuBlur}
			data-testid="user-menu"
		>
			<button
				ref={toggleEl}
				className="relative z-10"
				aria-expanded={isOpen.toString()}
				aria-controls="user-nav"
				onClick={onToggleClick}
				data-testid="menu-toggle"
			>
				<img
					className="h-6 inline rounded-full"
					src={user.picture}
					alt={`${isOpen ? "Close" : "Open"} user navigation`}
					style={{ boxShadow: "0 0 0 2px #fff" }}
				/>
			</button>
			<div
				id="user-nav"
				className={classNames(
					"bg-white text-gray-900 rounded absolute z-0 shadow-2xl",
					!isOpen && "hidden"
				)}
				style={{ minWidth: "12rem", top: "-0.75rem", right: "-0.75rem" }}
			>
				<p className="italic leading-normal p-3 pr-12 text-gray-700 text-xs border-b border-gray-200">
					Logged in as {user.name}
				</p>
				<a className="block p-3" href="/logout">
					Logout <span className="sr-only">{user.name}</span>
				</a>
			</div>
		</nav>
	);
}

UserMenu.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		picture: PropTypes.string.isRequired
	}).isRequired
};

export default UserMenu;
