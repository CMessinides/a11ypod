import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useRouter } from "next/router";

function NavLink({ href, children }) {
	const router = useRouter();
	const isActive = router.pathname === href;

	const onClick = e => {
		e.preventDefault();
		router.push(href);
	};

	return (
		<a
			href={href}
			onClick={onClick}
			className={classNames(
				"block px-3 py-4 flex-grow border-b-2 font-medium border-transparent hover:text-white hover:bg-purple-600 sm:px-6",
				isActive ? "border-white" : "text-purple-200"
			)}
		>
			{children}
		</a>
	);
}

NavLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default NavLink;
