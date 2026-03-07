import NotFound from "@/pages/NotFound";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("NotFound Page", () => {
	it("should render 404 heading when page is rendered", () => {
		renderWithProviders(<NotFound />);
		expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
	});

	it("should render error message when page is rendered", () => {
		renderWithProviders(<NotFound />);
		expect(screen.getByText(/Sorry, the page you're looking for doesn't exist/i)).toBeInTheDocument();
	});

	it("should render go to dashboard button when page is rendered", () => {
		renderWithProviders(<NotFound />);
		expect(screen.getByRole("button", { name: /Go to Dashboard/i })).toBeInTheDocument();
	});

	it("should navigate to dashboard when button clicked", async () => {
		renderWithProviders(<NotFound />);

		const button = screen.getByRole("button", { name: /Go to Dashboard/i });
		await userEvent.click(button);

		expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
	});

	it("should display error icon when page is rendered", () => {
		renderWithProviders(<NotFound />);
		expect(screen.getByText("error_outline")).toBeInTheDocument();
	});
});
