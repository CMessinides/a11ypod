import fetch from "isomorphic-unfetch";
import { graphqlEndpoint } from "../env";

/**
 * @param {RequestInit} config
 */
export function initGraphqlRequest({ headers, ...otherConfig } = {}) {
	return {
		...otherConfig,
		headers: {
			...headers,
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST"
	};
}

/**
 * @param {RequestInit} config
 */
export async function fetchGraphql(config = {}) {
	try {
		const { data, errors } = await (await fetch(
			graphqlEndpoint,
			initGraphqlRequest(config)
		)).json();

		if (errors) {
			throw new Error(
				`${errors[0].extensions.code || "UNKNOWN_ERROR"}: ${errors[0].message}`
			);
		}

		return data;
	} catch (e) {
		if (e.name !== "AbortError") throw e;
	}
}
