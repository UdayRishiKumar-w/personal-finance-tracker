import { Box, Button, Typography } from "@mui/material";
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

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("React error boundary has caught an error:", error, info);
	}

	handleReload = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<Box className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
					<Typography variant="h4" className="mb-4 font-bold">
						Something went wrong!
					</Typography>
					<Typography variant="body1" className="mb-4 text-gray-600">
						{import.meta.env.DEV ? this.state.error?.message : "An unexpected error occurred."}
					</Typography>
					<Button variant="contained" color="primary" onClick={this.handleReload} className="!mt-4">
						Reload App
					</Button>
				</Box>
			);
		}

		return this.props.children;
	}
}
