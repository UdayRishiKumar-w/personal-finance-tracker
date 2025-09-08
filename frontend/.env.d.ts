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
	const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
	export { ReactComponent };
	const src: string;
	export default src;
}
