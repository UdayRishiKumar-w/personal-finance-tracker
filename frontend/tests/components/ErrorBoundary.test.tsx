import ErrorBoundary from "@/components/ErrorBoundary";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
	if (shouldThrow) {
		throw new Error("Test error");
	}
	return <div>No error</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;

describe("ErrorBoundary", () => {
	beforeEach(() => {
		console.error = vi.fn();
	});

	afterEach(() => {
		console.error = originalError;
	});

	it("should render children normally when no error", () => {
		renderWithProviders(
			<ErrorBoundary>
				<div>Normal content</div>
			</ErrorBoundary>,
		);

		expect(screen.getByText("Normal content")).toBeInTheDocument();
	});

	it("should catch errors and display fallback UI", () => {
		renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText(/Uh-oh, looks like we hit a snag/i)).toBeInTheDocument();
	});

	it("should show Try Again button", () => {
		renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
	});

	it("should show Reload App button", () => {
		renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByRole("button", { name: /reload app/i })).toBeInTheDocument();
	});

	it("should reset error state when Try Again is clicked", async () => {
		const user = userEvent.setup();
		const { rerender } = renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		// Error should be shown
		expect(screen.getByText(/Uh-oh, looks like we hit a snag/i)).toBeInTheDocument();

		// Rerender without error and click Try Again
		rerender(
			<ErrorBoundary>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>,
		);

		await user.click(screen.getByRole("button", { name: /try again/i }));

		// After reset, should show normal content
		expect(screen.getByText("No error")).toBeInTheDocument();
	});

	it("should reload the page when Reload App is clicked", async () => {
		const user = userEvent.setup();
		const reloadMock = vi.fn();
		vi.stubGlobal("location", { reload: reloadMock });

		renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		await user.click(screen.getByRole("button", { name: /reload app/i }));
		expect(reloadMock).toHaveBeenCalled();
	});

	it("should log error to console", () => {
		renderWithProviders(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(console.error).toHaveBeenCalled();
	});
});
