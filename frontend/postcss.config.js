import cssnano from "cssnano";
import process from "node:process";

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
