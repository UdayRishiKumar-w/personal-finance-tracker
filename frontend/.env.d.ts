declare module "*.module.css" {
	const classes: { [key: string]: string };
	export default classes;
}

declare module "*.css" {
	const classes: { [key: string]: string };
	export default classes;
}

declare module "*.svg" {
	import * as React from "react";
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
	const src: string;
	export default src;
}

import "@tanstack/react-query";

declare module "@tanstack/react-query" {
	interface Register {
		// Use unknown so call sites must narrow explicitly.
		defaultError: unknown;
	}
}

interface MyMeta extends Record<string, unknown> {
	// meta type definition.
}

declare module "@tanstack/react-query" {
	interface Register {
		queryMeta: MyMeta;
		mutationMeta: MyMeta;
	}
}
