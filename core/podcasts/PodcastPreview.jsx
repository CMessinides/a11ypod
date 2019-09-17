import React from "react";
import PropTypes from "prop-types";

function PodcastPreview({ title, publisher, thumbnail }) {
	return (
		<article>
			<div className="flex items-start">
				<img
					className="w-16 h-16 bg-gray-200 mr-3"
					src={thumbnail._100w}
					srcSet={Object.keys(thumbnail)
						.map(width => `${thumbnail[width]} ${width.slice(1)}`)
						.join(",")}
					alt=""
					width="100"
					height="100"
				/>
				<header>
					<h2 className="text-lg font-bold leading-tight -mt-1 max-lines-2">
						{title}
					</h2>
					<dl className="max-lines-1">
						<dt className="sr-only">Publisher</dt>
						<dd className="text-sm text-gray-700">{publisher.name}</dd>
					</dl>
				</header>
			</div>
		</article>
	);
}

PodcastPreview.propTypes = {
	title: PropTypes.string.isRequired,
	publisher: PropTypes.shape({
		name: PropTypes.string.isRequired
	}),
	thumbnail: PropTypes.shape({
		_30w: PropTypes.string.isRequired,
		_60w: PropTypes.string.isRequired,
		_100w: PropTypes.string.isRequired,
		_600w: PropTypes.string.isRequired
	})
};

export default PodcastPreview;
