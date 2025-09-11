import App from "@/App";
import { render, screen } from "@testing-library/react";

describe("App component", () => {
	it("renders the personal text", () => {
		render(<App />);
		expect(screen.getByText(/personal/i)).toBeInTheDocument();
	});
});
