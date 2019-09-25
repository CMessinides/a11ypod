import React from "react";
import Search from "./Search";
import {
	render,
	cleanup,
	wait,
	waitForElement,
	fireEvent
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";

jest.mock("isomorphic-unfetch");
import fetch from "isomorphic-unfetch";
import { createFetchMocks } from "../test-helpers";
import mockResultsWithMore from "./__fixtures__/search-results-with-more.json";
import mockEndOfResults from "./__fixtures__/search-results-end-of-results.json";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);
mockFetchResolve({ json: mockResultsWithMore, once: false });
afterEach(fetch.mockClear);

afterEach(cleanup);

it("should default to an empty state", () => {
	const { Container } = createStore();
	const { getByRole, getByText, getByLabelText } = render(
		<Container>
			<Search />
		</Container>
	);

	// The page should render a search form with an empty input
	const searchForm = getByRole("search");
	const input = getByLabelText(/search term/i);
	expect(searchForm).toContainElement(input);
	expect(input).toHaveValue("");

	// The page should render an alert with instructions
	const alert = getByRole("alert");
	expect(alert).toHaveAttribute("aria-live", "polite");
	expect(alert).toHaveTextContent(/Enter a search term/i);

	// The page should render a prompt that is hidden to screen readers (it's redundant with the alert)
	const prompt = getByText("Type a search term above to see results here.");
	expect(prompt).toHaveAttribute("aria-hidden", "true");
});

it("should fetch and display search results when the user types a new term", async () => {
	expect.assertions(4);

	const { Container } = createStore();
	const { getByLabelText, getByRole } = render(
		<Container>
			<Search />
		</Container>
	);

	const input = getByLabelText(/search term/i);
	const alert = getByRole("alert");
	fireEvent.change(input, { target: { value: "vox" } });

	// The input value should be the new term
	expect(input).toHaveValue("vox");

	// The alert should notify the user that the results are loading
	expect(alert).toHaveTextContent(/loading results/i);

	// Wait for the search results list to appear
	await waitForElement(() => getByLabelText(/search results/i));

	// The results list should be visible
	const resultsList = getByLabelText(/search results/i);
	expect(resultsList.children.length).toBe(5);

	// The alert should notify the user of the results
	expect(alert).toHaveTextContent(/5 results/i);
});

it("should allow the user to load more results if they exist", async () => {
	expect.assertions(4);

	// Begin with some results already loaded (eg. from server-rendering)
	const { Container } = createStore();
	const { getByText, getByLabelText } = render(
		<Container>
			<Search
				initialTerm="vox"
				initialValue={mockResultsWithMore.data.searchPodcasts}
			/>
		</Container>
	);

	// The search page should display a "Load More" button, since the mock
	// GraphQL response indicated that there were more results to load.
	const loadMoreBtn = getByText(/load more results/i);
	expect(loadMoreBtn).toBeInTheDocument();

	// Mock the GraphQL service to respond with the last set of results for
	// this query (i.e. no more results to retriveve).
	mockFetchResolve({ json: mockEndOfResults });

	// Simulate the user clicking on the Load More button
	fireEvent.click(loadMoreBtn);

	const resultsList = getByLabelText(/search results/i);
	await wait(() => {
		// The list should now contain the previous results + the new results
		expect(resultsList.children.length).toBe(10);
	});

	// The focus should be moved to the first of the newly loaded results
	expect(document.activeElement).toBe(resultsList.children[5]);
	// The Load More button should now be gone, since there are no more results
	// to load.
	expect(loadMoreBtn).not.toBeInTheDocument();
});

it("should display an error if the search fails", async () => {
	expect.assertions(1);

	// Mock a failure on every fetch
	mockFetchReject({ reason: new Error(), once: false });

	const { Container } = createStore();
	const { getByLabelText, getByRole } = render(
		<Container>
			<Search />
		</Container>
	);

	const input = getByLabelText(/search term/i);
	const alert = getByRole("alert");
	fireEvent.change(input, { target: { value: "vox" } });

	// The alert should notify the user of the error
	await wait(() => {
		expect(alert).toHaveTextContent("error");
	});

	// Return the default mock fetch behavior
	mockFetchResolve({ json: mockResultsWithMore, once: false });
});

describe("getInitialProps", () => {
	it("should return search results for the term in the query string", () => {
		const query = { q: "vox" };
		const { store } = createStore();

		return expect(
			Search.getInitialProps({ query, store })
		).resolves.toStrictEqual({
			initialTerm: "vox",
			initialValue: mockResultsWithMore.data.searchPodcasts
		});
	});

	it("should return an error if the search fails", () => {
		mockFetchReject({ reason: new Error() });

		const query = { q: "vox" };
		const { store } = createStore();

		return expect(
			Search.getInitialProps({ query, store })
		).resolves.toStrictEqual({
			initialTerm: "vox",
			initialValue: expect.any(Error)
		});
	});

	it("should return no initial value if the query is empty", () => {
		const query = {};
		const { store } = createStore();

		return expect(
			Search.getInitialProps({ query, store })
		).resolves.toStrictEqual({
			initialTerm: ""
		});
	});
});
