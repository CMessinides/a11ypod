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
import mockData from "../podcasts/__fixtures__/gql-search-podcasts.json";
const { mockFetchResolve, mockFetchReject } = createFetchMocks(fetch);
mockFetchResolve({ json: mockData, once: false });

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
	expect(alert).toHaveTextContent(
		"Type a search term into the form above to get results."
	);

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
	const resultsList = await getByLabelText(/search results/i);
	expect(resultsList.children.length).toBe(5);

	// The alert should notify the user of the results
	expect(alert).toHaveTextContent(/5 results/i);
});

it("should display an error if the search fails", async () => {
	expect.assertions(1);

	mockFetchReject({ reason: new Error() });

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
});
