import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { StackedCard } from "./Card";

function CardStack({ className, children, ...otherProps }) {
	return (
		<ul className={classNames("card-stack", className)} {...otherProps}>
			{React.Children.map(children, child => (
				<StackedCard as="li" className="card-stack__item">
					{child}
				</StackedCard>
			))}
		</ul>
	);
}

CardStack.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

export default CardStack;
