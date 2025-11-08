import Box from "@mui/material/Box";
import type { ChartData, ChartOptions } from "chart.js";
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, zoomPlugin);

export default function BalanceChart() {
	const data: ChartData<"line", number[], string> = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May"],
		datasets: [{ label: "Balance", data: [1000, 1200, 1100, 1500, 1700], tension: 0.4 }],
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		plugins: {
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					mode: "xy",
				},
				pan: {
					enabled: true,
					mode: "xy",
				},
			},
		},
	};

	return (
		<Box className="h-3/4 w-full max-w-3xl">
			<Line data={data} options={options} className="dark:brightness-0 dark:invert" />
		</Box>
	);
}
