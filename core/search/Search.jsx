import React from "react";
import SearchInput from "./SearchInput";

function Search() {
	return (
		<div className="page">
			<h1 className="sr-only">Search</h1>
			<form role="search" aria-label="Podcasts" className="pb-3 sm:pb-6">
				<SearchInput
					id="podcast-search"
					label="Search all podcasts"
					placeholder="Search podcasts"
				/>
			</form>
			<div
				id="result-count-alert"
				className="sr-only"
				role="alert"
				aria-live="polite"
			>
				There are no results to display yet. Search using the form above to see
				results.
			</div>
			<div className="page__blurb my-auto text-center" aria-hidden="true">
				Type a search term above to see results here.
			</div>
		</div>
	);
}

Search.getInitialProps = async ctx => {
	console.log(ctx);
	return {};
};

export default Search;
