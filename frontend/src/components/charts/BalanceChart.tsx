import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

export default function BalanceChart() {
	const data = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May"],
		datasets: [{ label: "Balance", data: [1000, 1200, 1100, 1500, 1700], tension: 0.4 }],
	};

	return (
		<div className="w-full max-w-3xl">
			<Line data={data} />
		</div>
	);
}
