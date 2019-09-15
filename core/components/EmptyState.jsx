import React from "react";
import PropTypes from "prop-types";

function EmptyState({ children }) {
	return <div className="page page--centered py-12">{children}</div>;
}

EmptyState.propTypes = {
	children: PropTypes.node
};

EmptyState.Heading = function EmptyStateHeading({ children }) {
	return <h1 className="page__title">{children}</h1>;
};

EmptyState.Heading.propTypes = {
	children: PropTypes.node
};

EmptyState.Blurb = function EmptyStateBlurb({ children }) {
	return <p className="page__blurb mt-8">{children}</p>;
};

EmptyState.Blurb.propTypes = {
	children: PropTypes.node
};

EmptyState.Actions = function EmptyStateActions({ children }) {
	return (
		<div className="mt-8">
			<div className="flex flex-wrap justify-center -m-1">
				{React.Children.map(children, child => (
					<div className="m-1">{child}</div>
				))}
			</div>
		</div>
	);
};

EmptyState.Actions.propTypes = {
	children: PropTypes.node
};

export default EmptyState;
