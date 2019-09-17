import React from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import LoginButton from "../auth/LoginButton";
import { useStoreState } from "easy-peasy";

function NavBar() {
	const user = useStoreState(state => state.users.currentUser);

	return (
		<header className="bg-purple-700 text-white shadow-lg leading-none flex flex-wrap items-baseline sm:flex-no-wrap">
			<a href="#main" className="button order-2 sr-only focus:not-sr-only">
				Skip navigation
			</a>
			<Link href="/">
				<a className="p-3 order-1 font-bold text-lg sm:py-0 sm:px-6">a11yPod</a>
			</Link>
			<nav className="text-center ml-auto w-full order-4 sm:order-3 sm:w-auto">
				<ul className="flex">
					<li className="flex-grow w-1/3 sm:w-auto">
						<NavLink href="/">{user ? "Your Feed" : "Home"}</NavLink>
					</li>
					<li className="flex-grow w-1/3 sm:w-auto">
						<NavLink href="/search">Search</NavLink>
					</li>
					<li className="flex-grow w-1/3 sm:w-auto">
						<NavLink href="/playlist">Playlist</NavLink>
					</li>
				</ul>
			</nav>
			<div className="ml-auto mr-3 order-3 sm:order-4 sm:mx-6">
				{user ? (
					<UserMenu user={user} />
				) : (
					<LoginButton className="button--inverse">Log in</LoginButton>
				)}
			</div>
		</header>
	);
}

export default NavBar;
