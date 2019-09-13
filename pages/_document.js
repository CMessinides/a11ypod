import React from "react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
	static getInitialProps(ctx) {
		return super.getInitialProps(ctx);
	}

	render() {
		return (
			<Html className="h-full">
				<Head />
				<body className="h-full text-base leading-normal bg-gray-100 text-gray-900">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default Document;
