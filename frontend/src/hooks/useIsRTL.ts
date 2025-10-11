import { useTranslation } from "react-i18next";

const useIsRTL = (): boolean => {
	const { i18n } = useTranslation();
	return i18n.dir() === "rtl";
};

export default useIsRTL;
