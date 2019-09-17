import React from "react";
import Search from "./Search";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";

const ___fetch = global.fetch;
// eslint-disable-next-line no-global-assign
global.fetch = jest.fn();
import { createFetchMocks } from "../test-helpers";
import mockData from "../podcasts/__fixtures__/gql-search-podcasts.json";
const { mockFetchResolve } = createFetchMocks(fetch);
mockFetchResolve({ json: mockData, once: false });

afterEach(cleanup);

afterAll(() => {
	// eslint-disable-next-line no-global-assign
	global.fetch = ___fetch;
});

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
	expect(alert).toHaveTextContent(
		"Type a search term into the form above to get results."
	);

	// The page should render a prompt that is hidden to screen readers (it's redundant with the alert)
	const prompt = getByText("Type a search term above to see results here.");
	expect(prompt).toHaveAttribute("aria-hidden", "true");
});

it("should fetch and display search results when the user types a new term", () => {
	const { Container } = createStore();
	const { getByLabelText } = render(
		<Container>
			<Search />
		</Container>
	);

	const input = getByLabelText(/search term/i);
	fireEvent.change(input, { target: { value: "vox" } });

	// The input value should be the new term
	expect(input).toHaveValue("vox");

	// TODO: Reimplement this test after refactoring away from `useFetch()`!
});
