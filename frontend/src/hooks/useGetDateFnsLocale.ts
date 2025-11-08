import type { Locale } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import { ru } from "date-fns/locale/ru";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const localeMap: Record<string, Locale> = {
	en: enUS,
	ar,
	ru,
	ja,
	de,
};

const useGetDateFnsLocale = (): Locale => {
	const { i18n } = useTranslation();
	return useMemo(() => localeMap[i18n.language] || enUS, [i18n.language]);
};

export default useGetDateFnsLocale;
