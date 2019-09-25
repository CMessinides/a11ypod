import { useReducer, useCallback, useMemo, useRef } from "react";
import { useStoreActions } from "easy-peasy";
import uniqBy from "lodash/fp/uniqBy";

export const SearchStatus = {
	OK: "OK",
	LOADING_NEW: "LOADING_NEW",
	FAILED_NEW: "FAILED_NEW",
	LOADING_MORE: "LOADING_MORE",
	FAILED_MORE: "FAILED_MORE"
};

export const SearchAction = {
	LOAD_NEW: "LOAD_NEW",
	REJECT_NEW: "REJECT_NEW",
	RECEIVE_NEW: "RECEIVE_NEW",
	LOAD_MORE: "LOAD_MORE",
	REJECT_MORE: "REJECT_MORE",
	RECEIVE_MORE: "RECEIVE_MORE",
	RESET: "RESET"
};

const INITIAL_DATA = {
	term: "",
	startIndex: 0,
	nextOffset: null,
	results: []
};

function init({ initialTerm, initialValue }) {
	const initialState = {
		status: SearchStatus.OK,
		term: initialTerm,
		focusOnResult: null,
		nextOffset: null,
		results: [],
		error: null
	};

	if (initialValue instanceof Error) {
		initialState.status = SearchStatus.FAILED_NEW;
		initialState.error = initialValue;
	} else {
		Object.assign(initialState, {
			nextOffset: initialValue.nextOffset,
			results: initialValue.results
		});
	}

	return initialState;
}

const dedupe = uniqBy("id");

function reducer(state, action) {
	switch (action.type) {
		case SearchAction.LOAD_NEW:
			return {
				...state,
				term: action.payload,
				status: SearchStatus.LOADING_NEW,
				results: [],
				nextOffset: null
			};
		case SearchAction.REJECT_NEW:
			return {
				...state,
				status: SearchStatus.FAILED_NEW,
				error: action.payload
			};
		case SearchAction.RECEIVE_NEW:
			return {
				...state,
				status: SearchStatus.OK,
				results: action.payload.results,
				nextOffset: action.payload.nextOffset
			};
		case SearchAction.LOAD_MORE:
			return {
				...state,
				status: SearchStatus.LOADING_MORE
			};
		case SearchAction.REJECT_MORE:
			return {
				...state,
				status: SearchStatus.FAILED_MORE,
				error: action.payload
			};
		case SearchAction.RECEIVE_MORE:
			return {
				...state,
				status: SearchStatus.OK,
				results: dedupe([...state.results, ...action.payload.results]),
				// move focus to the first new result
				focusOnResult: state.results.length,
				nextOffset: action.payload.nextOffset
			};
		case SearchAction.RESET:
			return init({ initialTerm: "", initialValue: INITIAL_DATA });
		default:
			throw new Error();
	}
}

export default function useSearch({
	initialTerm = "",
	initialValue = INITIAL_DATA
}) {
	const controller = useRef({ abort() {} });
	const [state, dispatch] = useReducer(
		reducer,
		{ initialTerm, initialValue },
		init
	);

	const searchPodcasts = useStoreActions(actions => actions.podcasts.search);

	const updateSearchTerm = useCallback(
		term => {
			controller.current.abort();

			if (!term) {
				dispatch({ type: SearchAction.RESET });
			} else {
				controller.current = new AbortController();
				dispatch({ type: SearchAction.LOAD_NEW, payload: term });
				searchPodcasts({ term, signal: controller.current.signal })
					.then(data => {
						dispatch({ type: SearchAction.RECEIVE_NEW, payload: data });
					})
					.catch(error => {
						if (error.name !== "AbortError") {
							dispatch({ type: SearchAction.REJECT_NEW, payload: error });
						}
					});
			}
		},
		[searchPodcasts]
	);

	const loadMoreResults = useCallback(() => {
		if (state.nextOffset !== null) {
			controller.current.abort();
			controller.current = new AbortController();
			dispatch({ type: SearchAction.LOAD_MORE });
			searchPodcasts({
				term: state.term,
				offset: state.nextOffset,
				signal: controller.current.signal
			})
				.then(data => {
					dispatch({ type: SearchAction.RECEIVE_MORE, payload: data });
				})
				.catch(error => {
					if (error.name !== "AbortError") {
						dispatch({ type: SearchAction.REJECT_MORE, payload: error });
					}
				});
		}
	}, [searchPodcasts, state.nextOffset, state.term]);

	return useMemo(
		() => ({
			...state,
			updateSearchTerm,
			loadMoreResults: state.nextOffset && loadMoreResults
		}),
		[state, loadMoreResults, updateSearchTerm]
	);
}
