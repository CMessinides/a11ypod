import React from "react";
import PropTypes from "prop-types";

function Button({ as: Component = "button", children, ...otherProps }) {
	return <Component {...otherProps}>{children}</Component>;
}

Button.propTypes = {
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
	children: PropTypes.node
};

export default Button;
