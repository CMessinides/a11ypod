import { protectPage, protectEndpoint } from "./middleware";

describe("protectPage", () => {
	it("should pass through if the user is authenticated", () => {
		// mock out an authenticated session
		const req = {
			isAuthenticated: () => true
		};
		const res = {};
		const next = jest.fn();

		protectPage(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it("should redirect to login if the user is unauthenticated", () => {
		// mock out an unauthenticated request
		const req = {
			isAuthenticated: () => false
		};
		// mock out the relevant methods on the response
		const res = {
			redirect: jest.fn()
		};
		const next = jest.fn();

		protectPage(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith("/login");
		expect(next).not.toHaveBeenCalled();
	});
});

describe("protectEndpoint", () => {
	it("should pass through if the user is authenticated", () => {
		// mock out an authenticated session
		const req = {
			isAuthenticated: () => true
		};
		const res = {};
		const next = jest.fn();

		protectEndpoint(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it("should send an error if the user is unauthenticated", () => {
		// mock out an unauthenticated request
		const req = {
			isAuthenticated: () => false
		};
		// mock out the relevant methods on the response
		const res = {
			status: jest.fn(function() {
				return this;
			}),
			send: jest.fn()
		};
		const next = jest.fn();

		protectEndpoint(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			error: "Request is unauthenticated."
		});
		expect(next).not.toHaveBeenCalled();
	});
});
