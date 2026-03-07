import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import i18next from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock useSearchParams
const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useSearchParams: () => [mockSearchParams, mockSetSearchParams],
	};
});

// Import after mocks are set up
import LanguageSelector from "@/components/LanguageSelector";

const mockChangeLanguage = vi.fn().mockResolvedValue(undefined as never);

describe("LanguageSelector", () => {
	beforeEach(() => {
		mockSearchParams = new URLSearchParams();
		mockSetSearchParams.mockClear();
		vi.clearAllMocks();
		mockChangeLanguage.mockClear();

		// Mock i18next.changeLanguage to prevent actual language change
		vi.spyOn(i18next, "changeLanguage").mockImplementation(mockChangeLanguage);
	});

	it("should render language selector with accessible label", () => {
		renderWithProviders(<LanguageSelector />);
		expect(screen.getByLabelText(/select.*language/i)).toBeInTheDocument();
	});

	it("should display language options when opened", async () => {
		const user = userEvent.setup();
		renderWithProviders(<LanguageSelector />);
		const select = screen.getByLabelText(/select.*language/i);
		await user.click(select);

		await waitFor(() => {
			expect(screen.getByRole("option", { name: /english/i })).toBeInTheDocument();
			expect(screen.getByRole("option", { name: /deutsch/i })).toBeInTheDocument();
		});
	});

	it("should update search params when option is selected", async () => {
		const user = userEvent.setup();
		renderWithProviders(<LanguageSelector />);
		const select = screen.getByLabelText(/select.*language/i);
		await user.click(select);

		// Wait for dropdown to open and find the German option
		const germanOption = await screen.findByRole("option", { name: /deutsch/i });
		await user.click(germanOption);

		// Verify setSearchParams was called after selection
		await waitFor(() => {
			expect(mockSetSearchParams).toHaveBeenCalled();
		});

		// Wait for i18next.changeLanguage to be called and resolved
		await waitFor(() => {
			expect(mockChangeLanguage).toHaveBeenCalledWith("de");
		});
	});
});
