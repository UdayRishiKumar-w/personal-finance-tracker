import { useTranslation } from "react-i18next";

const Loader = ({ text }: { text?: string }) => {
	const { t } = useTranslation("loader");

	return (
		<div className="mask cursor-not-allowed">
			<div className="mask-wrapper">
				<div className="mask-content">
					<div className="spinner spinning duration-300 fade-in">
						<span className="spinner-bar"></span>
						<span className="spinner-bar spinner-bar1"></span>
						<span className="spinner-bar spinner-bar2"></span>
						<span className="spinner-bar spinner-bar3"></span>
					</div>
					<span className="text">{text || `${t("loading")}...`}</span>
				</div>
			</div>
		</div>
	);
};

export default Loader;
