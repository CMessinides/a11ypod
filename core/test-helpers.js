import React from "react";
import StoreModel from "./store/StoreModel";
import { StoreProvider, createStore as createEasyPeasyStore } from "easy-peasy";

export function createFetchMocks(fetch = jest.fn()) {
	const mocks = {
		fetch,
		mockFetchResolve: function({
			status = 200,
			statusText = "OK",
			json = {},
			text = "",
			once = true
		} = {}) {
			const mockMethod = once ? "mockResolvedValueOnce" : "mockResolvedValue";

			fetch[mockMethod]({
				status,
				statusText,
				json: () => (json instanceof Promise ? json : Promise.resolve(json)),
				text: () => (text instanceof Promise ? text : Promise.resolve(text)),
				get ok() {
					return this.status >= 200 && this.status < 300;
				},
				clone() {
					return Object.assign({}, this);
				}
			});

			return this;
		},
		mockFetchReject: function({
			reason = new Error("Network error"),
			once = true
		} = {}) {
			const mockMethod = once ? "mockRejectedValueOnce" : "mockRejectedValue";

			fetch[mockMethod](reason);

			return this;
		}
	};

	mocks.mockFetchResolve = mocks.mockFetchResolve.bind(mocks);
	mocks.mockFetchReject = mocks.mockFetchReject.bind(mocks);

	return mocks;
}

export function createStore({ initialState } = {}) {
	const store = createEasyPeasyStore(StoreModel, { initialState });
	return {
		store,
		StoreProvider,
		// eslint-disable-next-line react/prop-types
		Container({ children }) {
			return <StoreProvider store={store}>{children}</StoreProvider>;
		}
	};
}
