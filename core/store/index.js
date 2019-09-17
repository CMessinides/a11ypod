/*
	This is an adaptation of the Next.js example for using Redux. On the server,
	a new store is created for every request (otherwise we would share one store
	between all requests/users). On the client, we save the store as a global
	variable and reuse it over the lifespan of the client session.

	See more at https://github.com/zeit/next.js/blob/canary/examples/with-redux/lib/with-redux-store.js
*/
import { createStore } from "easy-peasy";
import StoreModel from "./StoreModel";

const isServer = typeof window === "undefined";
const __A11YPOD_CLIENT_STORE__ = "__A11YPOD_CLIENT_STORE__";

/**
 * @returns {import("easy-peasy").Store<StoreModel>}
 */
export function getOrCreateStore(initialState) {
	// Always create a new store on the server
	if (isServer) {
		return createStore(StoreModel, { initialState });
	}

	// Create and save store if none yet exists
	if (!window[__A11YPOD_CLIENT_STORE__]) {
		window[__A11YPOD_CLIENT_STORE__] = createStore(StoreModel, {
			initialState
		});
	}

	return window[__A11YPOD_CLIENT_STORE__];
}
