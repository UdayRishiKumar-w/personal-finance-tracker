import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<Box className="flex h-full flex-col items-center justify-center bg-gray-50 px-4 text-center text-gray-900 dark:bg-gray-950 dark:text-gray-100">
			<Box className="mb-6 animate-bounce text-red-500">
				<span className="material-icons !text-8xl">error_outline</span>
			</Box>

			<Typography variant="h1" className="animate-fade-in text-4xl font-bold text-gray-800 dark:text-gray-300">
				404 - Page Not Found
			</Typography>

			<Typography variant="body1" className="animate-fade-in mt-4 text-lg text-gray-600 dark:text-gray-500">
				Sorry, the page you're looking for doesn't exist or has been moved.
			</Typography>

			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate("/dashboard")}
				className="animate-fade-in mt-6"
			>
				Go to Dashboard
			</Button>
		</Box>
	);
};

export default NotFound;
