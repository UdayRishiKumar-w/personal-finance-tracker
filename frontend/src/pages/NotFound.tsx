import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
			<div className="mb-6 animate-bounce text-red-500">
				<span className="material-icons !text-8xl">error_outline</span>
			</div>

			<h1 className="animate-fade-in text-4xl font-bold text-gray-800">404 - Page Not Found</h1>

			<p className="animate-fade-in mt-4 text-lg text-gray-600">
				Sorry, the page you're looking for doesn't exist or has been moved.
			</p>

			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate("/dashboard")}
				className="animate-fade-in mt-6"
			>
				Go to Dashboard
			</Button>
		</div>
	);
};

export default NotFound;
