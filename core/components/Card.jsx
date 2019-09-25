import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const cardPropTypes = {
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
	children: PropTypes.node,
	className: PropTypes.string
};

function Card({ as: Component = "div", className, children, ...otherProps }) {
	return (
		<Component {...otherProps} className={classNames("card", className)}>
			{children}
		</Component>
	);
}

Card.propTypes = cardPropTypes;

export const StackedCard = Card;

function StandaloneCard({ className, children, ...otherProps }) {
	return (
		<Card {...otherProps} className={classNames("card--standalone", className)}>
			{children}
		</Card>
	);
}

StandaloneCard.propTypes = cardPropTypes;

export default StandaloneCard;
