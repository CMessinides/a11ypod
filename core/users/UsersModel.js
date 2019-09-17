import { action } from "easy-peasy";

const UsersModel = {
	currentUser: null,
	login: action((state, payload) => {
		state.currentUser = payload;
	})
};

export default UsersModel;
