import { languageOptions, type LanguageCode } from "@/Constants";
import { getLangSupported } from "@/utils/utils";
import LanguageIcon from "@mui/icons-material/Language";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import i18next from "i18next";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const LanguageSelector: FC = () => {
	const [language, setLanguage] = useState(i18next.language);
	const { i18n, t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		setLanguage((prev) => getLangSupported(prev));
	}, []);

	useEffect(() => {
		const lng = searchParams.get("lng");
		if (lng) {
			const supportedLng = getLangSupported(lng);
			setLanguage(supportedLng);
			i18next.changeLanguage(supportedLng);
		}
	}, [searchParams]);

	const handleLanguageChange = (e: SelectChangeEvent<LanguageCode>) => {
		const selectedLanguage = e.target.value;
		setLanguage(selectedLanguage);

		setSearchParams((searchParams) => {
			searchParams.set("lng", selectedLanguage);
			return searchParams;
		});

		i18next.changeLanguage(selectedLanguage);
	};

	useEffect(() => {
		document.documentElement.dir = i18n.dir(); //sets the body to ltr or rtl
		document.documentElement.lang = i18n.language; //sets the lang attribute on html tag
		document.title = t("appName");
	}, [i18n.language]);

	return (
		<Select
			value={language as LanguageCode}
			onChange={handleLanguageChange}
			variant="standard"
			className="text-black dark:text-white [&>svg]:text-black dark:[&>svg]:text-white"
			disableUnderline
			startAdornment={
				<InputAdornment position="start">
					<LanguageIcon className="mr-2" />
				</InputAdornment>
			}
		>
			{languageOptions.map(({ language, code }) => (
				<MenuItem value={code} key={code}>
					{language}
				</MenuItem>
			))}
		</Select>
	);
};

export default LanguageSelector;
