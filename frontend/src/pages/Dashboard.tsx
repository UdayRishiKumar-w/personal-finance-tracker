import { useTransactions } from "@/api/transactionsApi";
import MonthlyChart from "@/components/charts/MonthlyChart";
import type { TransactionData } from "@/types/globalTypes";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { format } from "date-fns/format";

const Dashboard: React.FC = () => {
	const { data, isLoading } = useTransactions(0, 1000);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<CircularProgress />
			</div>
		);
	}

	const transactions: TransactionData[] = data?.content ?? [];

	const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount), 0);
	const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount), 0);
	const balance = totalIncome - totalExpense;

	return (
		<div className="space-y-6 p-4 text-gray-900 dark:text-gray-100">
			<Typography variant="h4" className="font-bold text-gray-800 dark:text-gray-100" component="h1">
				Dashboard
			</Typography>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
					<CardHeader
						title={
							<Typography variant="body2" className="text-gray-500 dark:text-gray-400">
								Balance
							</Typography>
						}
					/>
					<CardContent>
						<Typography variant="h5" className="font-semibold">
							{balance.toFixed(2)}
						</Typography>
					</CardContent>
				</Card>

				<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
					<CardHeader
						title={
							<Typography variant="body2" className="text-gray-500 dark:text-gray-400">
								Total Income
							</Typography>
						}
					/>
					<CardContent>
						<Typography variant="h5" className="font-semibold text-green-600 dark:text-green-400">
							{totalIncome.toFixed(2)}
						</Typography>
					</CardContent>
				</Card>

				<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
					<CardHeader
						title={
							<Typography variant="body2" className="text-gray-500 dark:text-gray-400">
								Total Expense
							</Typography>
						}
					/>
					<CardContent>
						<Typography variant="h5" className="font-semibold text-red-600 dark:text-red-400">
							{totalExpense.toFixed(2)}
						</Typography>
					</CardContent>
				</Card>
			</div>

			<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
				<CardHeader
					title={
						<Typography variant="h6" className="font-semibold text-gray-800 dark:text-gray-100">
							Income vs Expense (Last 6 Months)
						</Typography>
					}
				/>
				<CardContent>
					<MonthlyChart months={6} />
				</CardContent>
			</Card>

			<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
				<CardHeader
					title={
						<Typography variant="h6" className="font-semibold text-gray-800 dark:text-gray-100">
							Recent Transactions
						</Typography>
					}
				/>
				<CardContent>
					<ul className="divide-y divide-gray-200 dark:divide-gray-700">
						{transactions.slice(0, 8).map((t: TransactionData) => (
							<li key={t.id} className="flex items-center justify-between py-3">
								<div className="flex flex-col">
									<span className="font-medium">{t.title}</span>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{t.category || "Uncategorized"} • {format(new Date(t.date), "dd MMM yyyy")}
									</span>
								</div>
								<span
									className={`font-semibold ${
										t.type === "EXPENSE"
											? "text-red-600 dark:text-red-400"
											: "text-green-600 dark:text-green-400"
									}`}
								>
									{Number(t.amount).toFixed(2)}
								</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;
