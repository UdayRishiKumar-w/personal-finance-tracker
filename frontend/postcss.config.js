import cssnano from "cssnano";

export default {
	plugins: [
		process.env.NODE_ENV === "production" &&
			cssnano({
				preset: "default",
				plugins: [["postcss-preset-env"]],
				discardComments: { removeAll: true },
			}),
	],
};
