import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { StackedCard } from "./Card";

function CardStack({ className, children, listRef, ...otherProps }) {
	return (
		<ul
			className={classNames("card-stack", className)}
			ref={listRef}
			{...otherProps}
		>
			{React.Children.map(children, child => (
				<StackedCard as="li" className="card-stack__item" tabIndex="-1">
					{child}
				</StackedCard>
			))}
		</ul>
	);
}

CardStack.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	listRef: PropTypes.object
};

export default CardStack;
