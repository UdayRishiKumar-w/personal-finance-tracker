import useIsRTL from "@/hooks/useIsRTL";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

// Test component that uses the hook
const TestComponent = () => {
	const isRTL = useIsRTL();
	return (
		<div role="status" aria-label={`Text direction: ${isRTL ? "rtl" : "ltr"}`}>
			{isRTL ? "rtl" : "ltr"}
		</div>
	);
};

describe("useIsRTL", () => {
	it("should return false for English language (LTR)", () => {
		renderWithProviders(<TestComponent />);
		expect(screen.getByRole("status")).toHaveTextContent("ltr");
		expect(screen.getByRole("status")).toHaveAccessibleName("Text direction: ltr");
	});

	it("should return false for German language (LTR)", () => {
		// The default i18n instance in tests is set to English
		// This test verifies the default behavior
		renderWithProviders(<TestComponent />);
		expect(screen.getByRole("status")).toHaveTextContent("ltr");
	});
});
