module.exports = {
	plugins: [
		require("postcss-import")(),
		require("tailwindcss")(),
		require("postcss-preset-env")({ stage: 2 }),
		require("autoprefixer")({ grid: true }),
		...(process.env.NODE_ENV === "production"
			? [
					require("@fullhuman/postcss-purgecss")({
						content: ["./pages/**/*.js", "./core/**/*.jsx"],
						defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
					})
			  ]
			: [])
	]
};
