import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type Props = {
	children: ReactNode;
};

type State = {
	hasError: boolean;
	error?: Error;
};

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("React error boundary has caught an error:", error, info);
	}

	handleReload = () => {
		globalThis.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<Box className="flex min-h-screen flex-col items-center justify-center p-6 text-center duration-300 fade-in">
					<Typography variant="h4" className="mb-4 font-bold">
						Uh-oh, looks like we hit a snag. Try again or reload the app.
					</Typography>
					<Typography variant="body1" className="mb-4 text-gray-600">
						{import.meta.env.DEV ? this.state.error?.message : "An unexpected error occurred."}
					</Typography>

					<Box className="flex gap-4">
						<Button variant="outlined" color="primary" onClick={this.resetError} className="mt-4">
							<span className="material-icons mr-2">replay</span>Try Again
						</Button>
						<Button variant="contained" color="primary" onClick={this.handleReload} className="mt-4">
							<span className="material-icons mr-2">refresh</span>Reload App
						</Button>
					</Box>
				</Box>
			);
		}

		return this.props.children;
	}
}
