import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { server } from "@tests/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	server.resetHandlers();
	vi.clearAllMocks();
});
afterAll(() => server.close());

vi.stubEnv("VITE_API_BASE", "http://localhost:3000");

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(globalThis, "matchMedia", {
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
