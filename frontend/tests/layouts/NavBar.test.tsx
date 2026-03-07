import NavBar from "@/layouts/NavBar";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("NavBar", () => {
	it("should render app title when navbar is mounted", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByRole("heading", { level: 1 }, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should render desktop navigation when navbar is mounted", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("desktop-nav", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should render navigation links when user is authenticated", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByRole("link", { name: /dashboard/i }, { timeout: 5000 })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /transactions/i })).toBeInTheDocument();
	});

	it("should render logout button when user is authenticated", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByRole("button", { name: /logout/i }, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should not render nav links when user is not authenticated", async () => {
		renderWithProviders(<NavBar />);

		// Wait for initial render to complete
		await screen.findByRole("heading", { level: 1 }, { timeout: 5000 });
		expect(screen.queryByRole("link", { name: /dashboard/i })).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: /transactions/i })).not.toBeInTheDocument();
	});

	it("should render mobile menu toggle button when navbar is mounted", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByLabelText("toggle menu", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should open and close mobile menu when toggle button clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		// Wait for initial render
		const menuButton = await screen.findByLabelText("toggle menu", {}, { timeout: 5000 });

		// Mobile menu should not be visible initially
		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

		// Click to open mobile menu
		await user.click(menuButton);

		// Mobile menu should now be visible
		expect(await screen.findByTestId("mobile-menu", {}, { timeout: 5000 })).toBeInTheDocument();

		// Click again to close
		await user.click(menuButton);

		// Mobile menu should be closed
		expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
	});

	it("should render language selector when navbar is mounted", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByLabelText(/select.*language/i, {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should render theme toggle button when navbar is mounted", async () => {
		renderWithProviders(<NavBar />, { preloadState: authenticatedState });

		expect(await screen.findByLabelText(/button to toggle theme/i, {}, { timeout: 5000 })).toBeInTheDocument();
	});
});
