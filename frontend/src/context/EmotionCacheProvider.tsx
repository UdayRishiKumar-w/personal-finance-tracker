import useIsRTL from "@/hooks/useIsRTL";
import { emotionCacheLTR, emotionCacheRTL } from "@/utils/commonUtils";
import { CacheProvider } from "@emotion/react";
import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";

const EmotionCacheProvider: FC<PropsWithChildren> = ({ children }) => {
	const isRTL = useIsRTL();

	const muiCache = useMemo(() => {
		return isRTL ? emotionCacheRTL : emotionCacheLTR;
	}, [isRTL]);

	return <CacheProvider value={muiCache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
