import { ThemeContext, getMuiTheme, useTheme } from "@/context/ThemeContext";
import { deDE, enUS } from "@mui/material/locale";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it, vi } from "vitest";

// Test component that uses the theme context
const TestThemeComponent = () => {
	const { mode, toggleTheme } = useTheme();
	return (
		<div>
			<p>Current theme: {mode}</p>
			<button onClick={toggleTheme} type="button">
				Toggle Theme
			</button>
		</div>
	);
};

describe("ThemeContext", () => {
	describe("useTheme hook", () => {
		it("should provide default light mode", () => {
			renderWithProviders(
				<ThemeContext.Provider value={{ mode: "light", toggleTheme: vi.fn() }}>
					<TestThemeComponent />
				</ThemeContext.Provider>,
			);

			expect(screen.getByText(/Current theme: light/i)).toBeInTheDocument();
		});

		it("should provide dark mode when set", () => {
			renderWithProviders(
				<ThemeContext.Provider value={{ mode: "dark", toggleTheme: vi.fn() }}>
					<TestThemeComponent />
				</ThemeContext.Provider>,
			);

			expect(screen.getByText(/Current theme: dark/i)).toBeInTheDocument();
		});

		it("should call toggleTheme when button is clicked", async () => {
			const user = userEvent.setup();
			const toggleTheme = vi.fn();
			renderWithProviders(
				<ThemeContext.Provider value={{ mode: "light", toggleTheme }}>
					<TestThemeComponent />
				</ThemeContext.Provider>,
			);

			await user.click(screen.getByRole("button", { name: /toggle theme/i }));

			expect(toggleTheme).toHaveBeenCalledTimes(1);
		});
	});

	describe("getMuiTheme", () => {
		it("creates theme with LTR direction", () => {
			const theme = getMuiTheme("ltr", enUS);
			expect(theme.direction).toBe("ltr");
		});

		it("creates theme with RTL direction", () => {
			const theme = getMuiTheme("rtl", enUS);
			expect(theme.direction).toBe("rtl");
		});

		it("creates theme with different locales", () => {
			const themeEN = getMuiTheme("ltr", enUS);
			const themeDE = getMuiTheme("ltr", deDE);

			// Both themes should have the same direction
			expect(themeEN.direction).toBe(themeDE.direction);
		});
	});
});
