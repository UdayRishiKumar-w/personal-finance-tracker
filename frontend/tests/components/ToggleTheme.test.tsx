import ToggleTheme from "@/components/ToggleTheme";
import { ThemeContext } from "@/context/ThemeContext";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it, vi } from "vitest";

// Helper to render with custom theme context
const renderWithTheme = (mode: "light" | "dark", toggleTheme = vi.fn()) => {
	return renderWithProviders(
		<ThemeContext.Provider value={{ mode, toggleTheme }}>
			<ToggleTheme />
		</ThemeContext.Provider>,
	);
};

describe("ToggleTheme", () => {
	it("should render DarkModeIcon when in light mode", () => {
		renderWithTheme("light");
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(screen.getByLabelText("dark")).toBeInTheDocument();
	});

	it("should render LightModeIcon when in dark mode", () => {
		renderWithTheme("dark");
		expect(screen.getByLabelText("light")).toBeInTheDocument();
	});

	it("should have correct aria-label for accessibility", () => {
		renderWithTheme("light");
		const button = screen.getByLabelText("button to toggle theme between dark and light");
		expect(button).toBeInTheDocument();
	});

	it("should have correct title in light mode", () => {
		renderWithTheme("light");
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("title", "Switch to dark mode");
	});

	it("should have correct title in dark mode", () => {
		renderWithTheme("dark");
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("title", "Switch to light mode");
	});

	it("should call toggleTheme when clicked", async () => {
		const user = userEvent.setup();
		const toggleTheme = vi.fn();
		renderWithTheme("light", toggleTheme);

		await user.click(screen.getByRole("button"));

		expect(toggleTheme).toHaveBeenCalledTimes(1);
	});
});
