import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App component", () => {
	it("renders the personal text", () => {
		render(<App />);
		expect(screen.getByText(/personal/i)).toBeInTheDocument();
	});
});
