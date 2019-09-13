import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function LoginButton({ className, children = "Log In" }) {
	return (
		<a
			className={classNames("button button--primary", className)}
			href="/login"
		>
			{children}
		</a>
	);
}

LoginButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

export default LoginButton;
