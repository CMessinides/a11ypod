import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useStoreActions } from "easy-peasy";
import { useAsync, IfPending, IfFulfilled, IfRejected } from "react-async";
import uniqBy from "lodash/fp/uniqBy";
import SearchInput from "./SearchInput";
import CardStack from "../components/CardStack";
import PodcastPreview from "../podcasts/PodcastPreview";

const INITIAL_DATA = {
	term: "",
	startIndex: 0,
	nextOffset: null,
	results: []
};

/**
 * Keep only unique podcasts
 */
const dedupe = uniqBy("id");

/**
 * Intercepts actions dispatched by `react-async`'s `useAsync()` hook to
 * handle the following special case: The fetch fulfilled and the search
 * term in the new data is the same as the current search term. This happens
 * when the user requests more results for the same term, in which case we
 * don't want to blow away the existing results. Therefore, we check whether
 * the old term and new term match, and if they do, we append the new results
 * to the old. Repeated results are removed.
 * @type {import("react-async").AsyncOptions<SearchResults>["reducer"]}
 */
const reducer = (state, action, internalReducer) => {
	if (action.type === "fulfill" && action.payload.term === state.data.term) {
		action.payload.results = dedupe([
			...state.data.results,
			...action.payload.results
		]);
	}

	return internalReducer(state, action);
};

function Search() {
	const [term, setTerm] = useState("");
	const searchPodcasts = useStoreActions(actions => actions.podcasts.search);
	const deferFn = useCallback(
		(args, props, { signal }) => {
			return searchPodcasts({ ...args[0], signal });
		},
		[searchPodcasts]
	);
	const search = useAsync({
		initialValue: INITIAL_DATA,
		deferFn,
		reducer
	});

	useEffect(() => {
		if (!term) {
			search.setData(INITIAL_DATA);
		} else {
			search.run({ term });
		}
		return search.cancel;
	}, [term, search.setData, search.run, search.cancel]);

	const onChange = e => setTerm(e.target.value);

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
						value={term}
						onChange={onChange}
					/>
				</form>
				<div
					id="result-count-alert"
					className="sr-only"
					role="alert"
					aria-live="polite"
				>
					<IfPending state={search}>Loading results.</IfPending>
					<IfRejected state={search}>
						There was an error retrieving the search results.
					</IfRejected>
					<IfFulfilled state={search}>
						{({ results, term }) => {
							if (term) {
								return `Found ${results.length} ${
									results.length === 1 ? "result" : "results"
								} for '${term}'.`;
							} else {
								return "Type a search term into the form above to get results.";
							}
						}}
					</IfFulfilled>
				</div>
				<IfPending state={search}>
					<div className="page__blurb my-auto text-center" aria-hidden="true">
						Loading&hellip;
					</div>
				</IfPending>
				<IfRejected state={search}>
					<div className="page__blurb my-auto text-center" aria-hidden="true">
						There was an error retrieving the search results. 😔
					</div>
				</IfRejected>
				<IfFulfilled state={search}>
					{({ results, term }) => {
						if (term) {
							return (
								<>
									<div
										className="text-sm text-gray-700 mb-3"
										aria-hidden="true"
									>
										Found {results.length}{" "}
										{results.length === 1 ? "result" : "results"} for &ldquo;
										{term}&rdquo;
									</div>
									<aside className="bg-yellow-300 text-sm p-3 sm:px-6 -mx-3 sm:-mx-6">
										<strong>🚧 Links to podcasts are coming soon.</strong> For
										now, search results do not link anywhere else.
									</aside>
									<CardStack
										className="-mx-3 sm:-mx-6"
										aria-label="Search results"
									>
										{results.map(podcast => (
											<PodcastPreview key={podcast.id} {...podcast} />
										))}
									</CardStack>
								</>
							);
						} else {
							return (
								<div
									className="page__blurb my-auto text-center"
									aria-hidden="true"
								>
									Type a search term above to see results here.
								</div>
							);
						}
					}}
				</IfFulfilled>
			</div>
		</>
	);
}

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
