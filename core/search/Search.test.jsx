import React from "react";
import Search from "./Search";
import { render, cleanup, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createStore } from "../test-helpers";

jest.mock("../graphql/Client");
import GraphqlClient from "../graphql/Client";
import mockData from "../podcasts/__fixtures__/gql-search-podcasts.json";
GraphqlClient.query.mockResolvedValue(mockData.data);

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
		"There are no results to display yet. Search using the form above to see results."
	);

	// The page should render a prompt that is hidden to screen readers (it's redundant with the alert)
	const prompt = getByText("Type a search term above to see results here.");
	expect(prompt).toHaveAttribute("aria-hidden", "true");
});

it("should fetch and display search results when the user types a new term", async () => {
	expect.assertions(8);

	const { Container } = createStore();
	const { getByRole, getByLabelText } = render(
		<Container>
			<Search />
		</Container>
	);

	const input = getByLabelText(/search term/i);
	fireEvent.change(input, { target: { value: "vox" } });

	// The input value should be the new term
	expect(input).toHaveValue("vox");

	// The alert should update with the number of results, and the results should
	// be displayed in a list
	const resultsCount = mockData.data.searchPodcasts.results.length;
	const alert = getByRole("alert");
	await wait(() => {
		expect(alert).toHaveTextContent(
			new RegExp(resultsCount + " results found", "i")
		);

		const results = getByLabelText(/search results/i).querySelectorAll("li");
		expect(results.length).toBe(resultsCount);
		results.forEach((result, i) => {
			const podcast = mockData.data.searchPodcasts.results[i];
			expect(result).toHaveTextContent(podcast.title);
		});
	});
});
