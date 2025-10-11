import useIsRTL from "@/hooks/useIsRTL";
import { useTranslation } from "react-i18next";

const Loader = ({ text }: { text?: string }) => {
	const { t } = useTranslation("loader");
	const isRTL = useIsRTL();

	return (
		<div className="mask cursor-not-allowed">
			<div className="mask-wrapper">
				<div className="mask-content">
					<div className="spinner spinning fade-in duration-300">
						<span className="spinner-bar"></span>
						<span className="spinner-bar spinner-bar1"></span>
						<span className="spinner-bar spinner-bar2"></span>
						<span className="spinner-bar spinner-bar3"></span>
					</div>
					<span className="text">{text || (isRTL ? `...${t("loading")}` : `${t("loading")}...`)}</span>
				</div>
			</div>
		</div>
	);
};

export default Loader;
