import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import LoginButton from "../auth/LoginButton";

function NavBar({ user }) {
	return (
		<header className="bg-purple-700 text-white shadow-lg leading-none flex flex-wrap items-baseline sm:flex-no-wrap">
			<Link href="/">
				<a className="p-3 order-1 font-bold text-lg sm:py-0 sm:px-6">
					Castaway
				</a>
			</Link>
			<nav className="text-center ml-auto w-full order-3 sm:order-2 sm:w-auto">
				<ul className="flex">
					<li className="flex-grow">
						<NavLink href="/">Home</NavLink>
					</li>
					<li className="flex-grow">
						<NavLink href="/search">Search</NavLink>
					</li>
					<li className="flex-grow">
						<NavLink href="/playlist">Playlist</NavLink>
					</li>
				</ul>
			</nav>
			<div className="ml-auto mr-3 order-2 sm:order-3 sm:mx-6">
				{user ? (
					<UserMenu user={user} />
				) : (
					<LoginButton className="button--inverse">Log in</LoginButton>
				)}
			</div>
		</header>
	);
}

NavBar.propTypes = {
	user: PropTypes.object
};

export default NavBar;
