import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll } from "vitest";

// runs a clean after each test case (e.g. clearing jsdom)
afterAll(() => {
	cleanup();
});

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // Deprecated
		removeListener: vi.fn(), // Deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
