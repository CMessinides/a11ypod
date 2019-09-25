import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { useRouter } from "next/router";
import useSearch, { SearchStatus } from "./useSearch";
import SearchInput from "./SearchInput";
import CardStack from "../components/CardStack";
import PodcastPreview from "../podcasts/PodcastPreview";

const SearchStateProps = {
	term: PropTypes.string.isRequired,
	results: PropTypes.array.isRequired,
	status: PropTypes.oneOf(Object.values(SearchStatus)).isRequired,
	loadMoreResults: PropTypes.func
};

function SearchAlertMessage({ term, results, status }) {
	switch (status) {
		case SearchStatus.OK:
			if (!term) {
				return "Enter a search term to load results.";
			} else {
				return `Found ${results.length} ${
					results.length === 1 ? "result" : "results"
				} for term "${term}".`;
			}
		case SearchStatus.LOADING_NEW:
			return `Loading results for term "${term}".`;
		case SearchStatus.FAILED_NEW:
			return `There was an error retrieving results for term "${term}".`;
		case SearchStatus.LOADING_MORE:
			return `Loading more results for term "${term}".`;
		case SearchStatus.FAILED_MORE:
			return `There was an error retrieving more results for term "${term}".`;
		default:
			throw new Error();
	}
}

SearchAlertMessage.propTypes = SearchStateProps;

function SearchResults({ term, results, status, listRef }) {
	switch (status) {
		case SearchStatus.LOADING_NEW:
			return (
				<div className="page__blurb my-auto text-center" aria-hidden="true">
					Loading&hellip;
				</div>
			);
		case SearchStatus.FAILED_NEW:
			return (
				<div className="page__blurb my-auto text-center" aria-hidden="true">
					There was an error retrieving the search results. 😔
				</div>
			);
		case SearchStatus.OK:
		default:
			if (!term) {
				return (
					<div className="page__blurb my-auto text-center" aria-hidden="true">
						Type a search term above to see results here.
					</div>
				);
			} else {
				return (
					<>
						<div className="text-sm text-gray-700 mb-3" aria-hidden="true">
							Found {results.length}{" "}
							{results.length === 1 ? "result" : "results"} for &ldquo;
							{term}&rdquo;
						</div>
						<aside className="bg-yellow-300 text-sm p-3 sm:px-6 -mx-3 sm:-mx-6">
							<strong>🚧 Links to podcasts are coming soon.</strong> For now,
							search results do not link anywhere else.
						</aside>
						<CardStack
							className="-mx-3 sm:-mx-6"
							aria-label="Search results"
							listRef={listRef}
						>
							{results.map(podcast => (
								<PodcastPreview key={podcast.id} {...podcast} />
							))}
						</CardStack>
					</>
				);
			}
	}
}

SearchResults.propTypes = {
	...SearchStateProps,
	listRef: PropTypes.object
};

function SearchLoadMoreButton({ loadMoreResults, status }) {
	if (!loadMoreResults) {
		return null;
	}

	if (status === SearchStatus.LOADING_MORE) {
		return <div className="mt-3 sm:mt-6 text-center">Loading&hellip;</div>;
	}

	return (
		<div className="mt-3 sm:mt-6 text-center">
			<button
				className="button button--secondary button--lg"
				type="button"
				onClick={loadMoreResults}
			>
				Load more results
			</button>
			{status === SearchStatus.FAILED_MORE && (
				<div className="mt-2 p-2 bg-red-200 text-red-700" aria-hidden="true">
					There was an error loading more results.
				</div>
			)}
		</div>
	);
}

SearchLoadMoreButton.propTypes = SearchStateProps;

function Search({ initialTerm, initialValue }) {
	const router = useRouter();
	const state = useSearch({ initialTerm, initialValue });
	const resultsList = useRef(null);

	useEffect(() => {
		if (router) {
			const href = "/search?q=" + state.term;
			router.replace(href, href, { shallow: true });
		}
	}, [state.term]);

	useEffect(() => {
		if (resultsList.current && state.focusOnResult !== null) {
			// focus on the first new result whenever more results are loaded
			resultsList.current.children[state.focusOnResult].focus();
		}
	}, [state.focusOnResult]);

	const onChange = e => state.updateSearchTerm(e.target.value);

	return (
		<>
			<Head>
				<title>Search Podcasts &mdash; a11yPod</title>
			</Head>
			<div className="page">
				<h1 className="sr-only">Search</h1>
				<form role="search" aria-label="Podcasts" className="pb-3 sm:pb-6">
					<SearchInput
						id="podcast-search"
						placeholder="Search podcasts"
						value={state.term}
						onChange={onChange}
					/>
				</form>
				<div
					id="result-count-alert"
					className="sr-only"
					role="alert"
					aria-live="polite"
				>
					<SearchAlertMessage {...state} />
				</div>
				<SearchResults {...state} listRef={resultsList} />
				<SearchLoadMoreButton {...state} />
			</div>
		</>
	);
}

Search.getInitialProps = async function({ query, store }) {
	const props = {
		initialTerm: query.q || ""
	};

	if (props.initialTerm) {
		const searchPodcasts = store.getActions().podcasts.search;
		try {
			props.initialValue = await searchPodcasts({ term: query.q });
		} catch (e) {
			props.initialValue = e;
		}
	}

	return props;
};

Search.propTypes = {
	initialTerm: PropTypes.string,
	initialValue: PropTypes.oneOfType([
		PropTypes.shape({
			term: PropTypes.string.isRequired,
			startIndex: PropTypes.number.isRequired,
			nextOffset: PropTypes.number,
			results: PropTypes.array.isRequired
		}),
		PropTypes.instanceOf(Error)
	])
};

export default Search;

// Type definitions

/**
 * Represents the results of a search query.
 * @typedef {import("../podcasts/PodcastRepo").PodcastSearchResults} SearchResults
 */

/**
 * Represents a GraphQL response to the searchPodcasts query.
 * @typedef {Object} GraphqlResponse
 * @property {Object} data
 * @property {SearchResults} data.searchPodcasts
 * @property {Object[]} [errors]
 */
