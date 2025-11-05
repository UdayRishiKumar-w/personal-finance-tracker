import { useTransactions } from "@/api/transactionsApi";
import { useTheme } from "@/context/ThemeContext";
import type { ChartData, ChartOptions } from "chart.js";
import {
	BarController,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
} from "chart.js";
import { format, subMonths } from "date-fns";
import type { FC } from "react";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, PointElement, LineElement, Legend, Tooltip);

interface MonthlyChartProps {
	months?: number;
}

const MonthlyChart: FC<MonthlyChartProps> = ({ months = 6 }) => {
	const { data } = useTransactions(0, 1000);
	const transactions = data?.content ?? [];

	const labels = Array.from({ length: months })
		.map((_, i) => subMonths(new Date(), months - i - 1))
		.map((d) => format(d, "MMM"));

	const { incomeData, expenseData } = useMemo(() => {
		const inc = new Array(months).fill(0);
		const exp = new Array(months).fill(0);
		transactions.forEach((t: { date: string | number | Date; type: string; amount: unknown }) => {
			const monthIndex =
				months - 1 - Math.floor((new Date().getTime() - new Date(t.date).getTime()) / (30 * 24 * 3600 * 1000));
			if (monthIndex >= 0 && monthIndex < months) {
				if (t.type === "INCOME") inc[monthIndex] += Number(t.amount);
				else if (t.type === "EXPENSE") exp[monthIndex] += Number(t.amount);
			}
		});
		return { incomeData: inc, expenseData: exp };
	}, [transactions, months]);

	const { mode } = useTheme();
	const isDark = useMemo(() => mode === "dark", [mode]);

	const dataConfig: ChartData<"bar", number[], string> = {
		labels,
		datasets: [
			{
				label: "Income",
				data: incomeData,
				backgroundColor: isDark ? "#22c55e" : "#16a34a",
				borderRadius: 6,
			},
			{
				label: "Expense",
				data: expenseData,
				backgroundColor: isDark ? "#ef4444" : "#dc2626",
				borderRadius: 6,
			},
		],
	};

	const options: ChartOptions<"bar"> = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
				labels: { color: isDark ? "#e5e7eb" : "#374151" },
			},
			tooltip: {
				backgroundColor: isDark ? "#1f2937" : "#f9fafb",
				titleColor: isDark ? "#f9fafb" : "#111827",
				bodyColor: isDark ? "#e5e7eb" : "#111827",
			},
		},
		scales: {
			x: {
				ticks: { color: isDark ? "#e5e7eb" : "#374151" },
				grid: { display: false },
			},
			y: {
				ticks: { color: isDark ? "#e5e7eb" : "#374151" },
				grid: { color: isDark ? "#374151" : "#e5e7eb" },
			},
		},
	};

	return (
		<div className="aspect-2/1 w-full">
			<Bar data={dataConfig} options={options} />
		</div>
	);
};

export default MonthlyChart;
