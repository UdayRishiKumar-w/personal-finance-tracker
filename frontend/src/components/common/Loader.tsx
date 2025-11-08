import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

const Loader = ({ text }: { text?: string }) => {
	const { t } = useTranslation("loader");

	return (
		<Box className="mask cursor-not-allowed">
			<Box className="mask-wrapper">
				<Box className="mask-content">
					<div className="spinner spinning duration-300 fade-in">
						<span className="spinner-bar"></span>
						<span className="spinner-bar spinner-bar1"></span>
						<span className="spinner-bar spinner-bar2"></span>
						<span className="spinner-bar spinner-bar3"></span>
					</div>
					<Typography variant="body2" component="span" className="text">
						{text || `${t("loading")}...`}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Loader;
