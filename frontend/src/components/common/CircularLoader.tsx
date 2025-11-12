import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import type { FC } from "react";

const CircularLoader: FC = () => {
	return (
		<Box className="flex h-full items-center justify-center">
			<CircularProgress />
		</Box>
	);
};

export default CircularLoader;
