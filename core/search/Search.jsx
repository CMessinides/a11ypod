import React, { useState, useEffect } from "react";
import { useFetch, IfPending, IfFulfilled, IfRejected } from "react-async";
import uniqBy from "lodash/fp/uniqBy";
import SearchInput from "./SearchInput";
import CardStack from "../components/CardStack";
import PodcastPreview from "../podcasts/PodcastPreview";
import { graphqlEndpoint } from "../env";
import { InternalServerError } from "../errors";

import query from "../podcasts/SearchQuery.graphql";

function createQuery(term) {
	return JSON.stringify({
		query,
		variables: { term }
	});
}

const INITIAL_DATA = {
	data: {
		searchPodcasts: {
			term: "",
			startIndex: 0,
			nextOffset: null,
			results: []
		}
	}
};

/**
 * Accepts a GraphQL response for the `searchPodcasts` query and returns
 * its data, error, or both.
 * @param {GraphqlResponse} response
 */
function unwrap({ data, errors }) {
	return {
		data: data && data.searchPodcasts,
		error:
			errors && new Error(`${errors[0].extensions.code}: ${errors[0].message}`)
	};
}

/**
 * Keep only unique podcasts
 */
const dedupe = uniqBy("id");

/**
 * Intercepts actions dispatched by `react-async`'s `useFetch()` hook to
 * handle two special cases:
 * - The fetch fulfilled, but GraphQL returned an error in the body of the
 *   response. In this case, we change the action to "reject" and return the
 *   GraphQL error as the payload.
 * - The fetch fulfilled and the search term in the new data is the same as
 *   the current search term. This happens when the user requests more results
 *   for the same term, in which case we don't want to blow away the existing
 *   results. Therefore, we check whether the old term and new term match, and
 *   if they do, we append the new results to the old. Repeated results are
 *   removed.
 * @type {import("react-async").AsyncOptions<SearchResults>["reducer"]}
 */
const reducer = (state, action, internalReducer) => {
	const newAction = { ...action };
	switch (action.type) {
		case "fulfill": {
			const { data, error } = unwrap(action.payload);
			if (error) {
				newAction.type = "reject";
				newAction.payload = new InternalServerError(error.message);
			} else {
				newAction.payload = Object.assign(
					data,
					data.term === state.data.term && {
						results: dedupe([...state.data.results, ...data.results])
					}
				);
			}
			break;
		}
		default:
			break;
	}

	return internalReducer(state, newAction);
};

function Search() {
	const [term, setTerm] = useState("");
	const search = useFetch(
		graphqlEndpoint,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: createQuery(term)
		},
		{
			initialValue: unwrap(INITIAL_DATA).data,
			reducer
		}
	);
	console.log("search state", search);

	useEffect(() => {
		if (!term) {
			search.setData(INITIAL_DATA);
		} else {
			search.run({ body: createQuery(term) });
		}
		return search.cancel;
	}, [term, search.setData, search.run, search.cancel]);

	const onChange = e => setTerm(e.target.value);

	return (
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
								<div className="text-sm text-gray-700 mb-3" aria-hidden="true">
									Found {results.length}{" "}
									{results.length === 1 ? "result" : "results"} for &ldquo;
									{term}&rdquo;
								</div>
								<CardStack className="-mx-3" aria-label="Search results">
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
