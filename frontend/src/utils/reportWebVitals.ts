import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

function logMetric(metric: Metric) {
	console.log(`[Web Vitals] ${metric.name}:`, metric);
}

export function reportWebVitals(): void {
	onCLS(logMetric);
	onINP(logMetric);
	onLCP(logMetric);
	onFCP(logMetric);
	onTTFB(logMetric);
}
