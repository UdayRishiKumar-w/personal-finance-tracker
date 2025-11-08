import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

function PWABadge() {
	// check for updates every hour
	const period = 60 * 60 * 1000;

	const intervalTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const {
		// offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(swUrl, r) {
			if (period <= 0) return;
			if (r?.active?.state === "activated") {
				intervalTimerRef.current = registerPeriodicSync(period, swUrl, r);
			} else if (r?.installing) {
				r.installing.addEventListener("statechange", (e) => {
					const sw = e.target as ServiceWorker;
					if (sw.state === "activated") {
						intervalTimerRef.current = registerPeriodicSync(period, swUrl, r);
					}
				});
			}
		},
	});

	const [isOffline, setIsOffline] = useState(!navigator.onLine);

	useEffect(() => {
		const handleOnline = () => setIsOffline(false);
		const handleOffline = () => setIsOffline(true);

		globalThis.addEventListener("online", handleOnline);
		globalThis.addEventListener("offline", handleOffline);

		return () => {
			clearInterval(intervalTimerRef.current);
			globalThis.removeEventListener("online", handleOnline);
			globalThis.removeEventListener("offline", handleOffline);
		};
	}, []);

	function close() {
		// setOfflineReady(false);
		setNeedRefresh(false);
		setIsOffline(false);
	}

	const shouldShow = needRefresh || isOffline;

	if (!shouldShow) return null;

	return (
		<Box
			role="alert"
			aria-labelledby="toast-message"
			className={clsx(
				"fixed right-4 bottom-4 z-50 flex flex-col items-center rounded border border-gray-300 bg-gray-50 p-4 text-gray-900 shadow-lg transition-transform duration-500 dark:bg-gray-950 dark:text-gray-100 dark:shadow-white",
				{
					"translate-y-0 opacity-100": isOffline || needRefresh,
					"translate-y-20 opacity-0": !(isOffline || needRefresh),
				},
			)}
		>
			<Typography id="toast-message" className="mb-2 text-center">
				{isOffline
					? "You are offline. Some features may not work."
					: "New content available, click reload to update."}
			</Typography>
			<Box className="flex space-x-2">
				{needRefresh && (
					<Button variant="contained" color="primary" onClick={async () => updateServiceWorker(true)}>
						Reload
					</Button>
				)}
				<Button variant="outlined" onClick={close}>
					Close
				</Button>
			</Box>
		</Box>
	);
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
	if (period <= 0) return;

	return setInterval(async () => {
		if ("onLine" in navigator && !navigator.onLine) return;

		const resp = await fetch(swUrl, {
			cache: "no-store",
			headers: {
				cache: "no-store",
				"cache-control": "no-cache",
			},
		});

		if (resp?.status === 200) await r.update();
	}, period);
}
