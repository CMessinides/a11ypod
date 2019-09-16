import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useStoreActions } from "easy-peasy";
import { useAsync } from "react-async";

async function fetchResults([search, term, offset = 0], { signal }) {
	console.log("fetching results!", { term });
	try {
		const data = await search({ variables: { term, offset }, signal });
		console.log("got data", { data, term });
		return { ...data, term };
	} catch (e) {
		console.log("error in fetchResults", e);
		throw e;
	}
	// console.log("fetched results", { ...data, term });
}

function Search() {
	const [term, setTerm] = useState("");
	const { data, error, run, cancel, setData } = useAsync({
		deferFn: fetchResults,
		initialValue: { term: "", results: [] },
		reducer: (prevState, action, internalReducer) => {
			const nextState = internalReducer(prevState, action);
			console.log({
				action,
				prevState,
				nextState
			});
			if (
				action.type === "fulfill" &&
				prevState.data.term === nextState.data.term
			) {
				nextState.data.results.unshift(...prevState.data.results);
			}
			// console.log({ prevState, finalState: nextState });
			return nextState;
		}
	});
	const search = useStoreActions(actions => actions.podcasts.search);

	useEffect(() => {
		// console.log("running effect", { term });
		if (!term) {
			// console.log("setting term to empty string!")
			setData({ term: "", results: [] });
		} else {
			// console.log("running the async effect!");
			run(search, term);
			return cancel;
		}
	}, [term, search, run, cancel, setData]);

	const onChange = e => setTerm(e.target.value);

	// The default message
	let alertMessage =
		"There are no results to display yet. Search using the form above to see results.";
	if (data.results.length) {
		alertMessage = `${data.results.length} results found.`;
	}

	// console.log("about to render", { data, error, term, alertMessage });
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
				{alertMessage}
			</div>
			{data.results.length ? (
				<ul className="-m-3" aria-label="Search results">
					{data.results.map(podcast => (
						<li key={podcast.id} className="p-3 bg-white">
							{podcast.title}
						</li>
					))}
				</ul>
			) : (
				<div className="page__blurb my-auto text-center" aria-hidden="true">
					Type a search term above to see results here.
				</div>
			)}
		</div>
	);
}

export default Search;
