import App from "@/App";
import { render, screen } from "@testing-library/react";

describe("App component", () => {
	it("should render the personal text when app is mounted", () => {
		render(<App />);
		expect(screen.getByText(/personal/i)).toBeInTheDocument();
	});
});
