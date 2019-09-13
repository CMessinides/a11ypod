import React from "react";
import PropTypes from "prop-types";

function EmptyState({ children }) {
	return (
		<div className="h-full flex flex-col justify-center text-center max-w-2xl px-3 py-12 sm:px-6 mx-auto">
			{children}
		</div>
	);
}

EmptyState.propTypes = {
	children: PropTypes.node
};

EmptyState.Heading = function EmptyStateHeading({ children }) {
	return <h1 className="text-3xl font-bold leading-tight">{children}</h1>;
};

EmptyState.Heading.propTypes = {
	children: PropTypes.node
};

EmptyState.Blurb = function EmptyStateBlurb({ children }) {
	return <p className="mt-8 text-gray-700 text-lg">{children}</p>;
};

EmptyState.Blurb.propTypes = {
	children: PropTypes.node
};

EmptyState.Actions = function EmptyStateActions({ children }) {
	return (
		<div className="mt-8">
			<div className="flex flex-wrap justify-center -m-1">{children}</div>
		</div>
	);
};

EmptyState.Actions.propTypes = {
	children: PropTypes.node
};

export default EmptyState;
