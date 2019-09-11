module.exports = {
	plugins: [
		require("tailwindcss")(),
		require("postcss-preset-env")({ stage: 2 }),
		require("autoprefixer")({ grid: true }),
		...(process.env.NODE_ENV === "production"
			? [
					require("@fullhuman/postcss-purgecss")({
						content: ["./pages/**/*.jsx", "./components/**/*.jsx"],
						defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
					})
			  ]
			: [])
	]
};
