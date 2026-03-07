import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { server } from "@tests/mocks/server";
import { toHaveNoViolations } from "jest-axe";
import { createElement } from "react";
import { expect, vi } from "vitest";

expect.extend(toHaveNoViolations);

// Mock react-chartjs-2 globally to avoid canvas rendering issues in jsdom
vi.mock("react-chartjs-2", () => ({
	Bar: (props: { "aria-label"?: string; "data-testid"?: string }) =>
		createElement(
			"div",
			{
				role: "img",
				"aria-label": props["aria-label"] || "Bar chart",
				"data-testid": props["data-testid"] || "mock-bar-chart",
			},
			createElement("canvas", { "data-testid": "chart-canvas" }),
		),
	Line: (props: { "aria-label"?: string; "data-testid"?: string }) =>
		createElement(
			"div",
			{
				role: "img",
				"aria-label": props["aria-label"] || "Line chart",
				"data-testid": props["data-testid"] || "mock-line-chart",
			},
			createElement("canvas", { "data-testid": "chart-canvas" }),
		),
}));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	server.resetHandlers();
	vi.clearAllMocks();
});
afterAll(() => server.close());

vi.stubEnv("VITE_API_BASE", "http://localhost:3000");
vi.stubEnv("MODE", "e2e"); // Disable React Query retries in tests

// Mock HTMLCanvasElement.getContext for Chart.js
// providing partial mock for canvas context in jsdom
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
	canvas: document.createElement("canvas"),
	fillRect: vi.fn(),
	clearRect: vi.fn(),
	getImageData: vi.fn(() => ({
		data: new Uint8ClampedArray(4),
	})),
	putImageData: vi.fn(),
	createImageData: vi.fn(() => ({
		data: new Uint8ClampedArray(4),
	})),
	setTransform: vi.fn(),
	resetTransform: vi.fn(),
	save: vi.fn(),
	restore: vi.fn(),
	scale: vi.fn(),
	rotate: vi.fn(),
	translate: vi.fn(),
	transform: vi.fn(),
	beginPath: vi.fn(),
	moveTo: vi.fn(),
	lineTo: vi.fn(),
	bezierCurveTo: vi.fn(),
	quadraticCurveTo: vi.fn(),
	closePath: vi.fn(),
	arc: vi.fn(),
	arcTo: vi.fn(),
	ellipse: vi.fn(),
	rect: vi.fn(),
	fill: vi.fn(),
	stroke: vi.fn(),
	clip: vi.fn(),
	isPointInPath: vi.fn(),
	isPointInStroke: vi.fn(),
	getTransform: vi.fn(),
	measureText: vi.fn(() => ({
		width: 0,
		actualBoundingBoxLeft: 0,
		actualBoundingBoxRight: 0,
		actualBoundingBoxAscent: 0,
		actualBoundingBoxDescent: 0,
	})),
	createLinearGradient: vi.fn(() => ({
		addColorStop: vi.fn(),
	})),
	createRadialGradient: vi.fn(() => ({
		addColorStop: vi.fn(),
	})),
	createPattern: vi.fn(),
	drawImage: vi.fn(),
	setLineDash: vi.fn(),
	getLineDash: vi.fn(() => []),
	chart: {
		update: vi.fn(),
		render: vi.fn(),
		destroy: vi.fn(),
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
})) as any;

// Mock canvas toDataURL for Chart.js snapshot tests
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,mock");

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(globalThis, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // Deprecated
		removeListener: vi.fn(), // Deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}),
});
