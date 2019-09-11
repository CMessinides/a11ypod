module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		"jest/globals": true
	},
	extends: ["eslint:recommended", "plugin:react/recommended"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: "module"
	},
	plugins: ["react", "jest"],
	rules: {
		// default to prettier for resolving indentation issues
		"no-mixed-spaces-and-tabs": "off"
	}
};
