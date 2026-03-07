import { Menu } from "@/components/Menu";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";

// Mock ToggleTheme since it uses context
vi.mock("@/components/ToggleTheme", () => ({
	default: () => <button aria-label="Toggle theme">Toggle Theme</button>,
}));

describe("Menu", () => {
	it("should render menu button", () => {
		renderWithProviders(<Menu />);
		const button = screen.getByRole("button", { name: /menu/i });
		expect(button).toBeInTheDocument();
	});

	it("should show menu icon initially", () => {
		renderWithProviders(<Menu />);
		expect(screen.getByText("menu")).toBeInTheDocument();
	});

	it("should show close icon when menu is open", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Menu />);
		await user.click(screen.getByRole("button", { name: /menu/i }));
		expect(screen.getByText("close")).toBeInTheDocument();
	});

	it("should toggle back to menu icon when clicked again", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Menu />);
		const button = screen.getByRole("button", { name: /menu/i });

		await user.click(button);
		expect(screen.getByText("close")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /close/i }));
		expect(screen.getByText("menu")).toBeInTheDocument();
	});

	it("should show ToggleTheme component when menu is open", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Menu />);

		// Initially ToggleTheme should not be visible
		expect(screen.queryByRole("button", { name: /toggle theme/i })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /menu/i }));
		expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
	});

	it("should hide ToggleTheme when menu is closed", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Menu />);

		await user.click(screen.getByRole("button", { name: /menu/i }));
		expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /close/i }));
		expect(screen.queryByRole("button", { name: /toggle theme/i })).not.toBeInTheDocument();
	});
});
