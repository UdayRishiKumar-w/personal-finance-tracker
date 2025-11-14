import { useTransactions } from "@/api/transactionsApi";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CircularLoader from "@/components/common/CircularLoader";
import useGetDateFnsLocale from "@/hooks/useGetDateFnsLocale";
import type { TransactionData } from "@/types/globalTypes";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { parseISO } from "date-fns";
import { format } from "date-fns/format";
import type { FC } from "react";

const Dashboard: FC = () => {
	const { data, isLoading, error } = useTransactions(0, 50);
	const dateFnsLocale = useGetDateFnsLocale();

	if (isLoading) {
		return <CircularLoader />;
	}

	if (error) {
		return (
			<Box className="flex h-full items-center justify-center">
				<Typography color="error">Failed to load dashboard data. Please try again.</Typography>
			</Box>
		);
	}

	const transactions: TransactionData[] = data?.content ?? [];

	const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount), 0);
	const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount), 0);
	const balance = totalIncome - totalExpense;

	return (
		<Box className="space-y-6 p-4 text-gray-900 dark:text-gray-100">
			<Typography variant="h4" className="font-bold text-gray-800 dark:text-gray-100">
				Dashboard
			</Typography>

			<Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
					<CardHeader
						title={
							<Typography
								variant="body1"
								className="text-gray-600 dark:text-gray-300"
								aria-label="Balance"
							>
								<span aria-hidden="true">💰</span> Balance
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
							<Typography
								variant="body1"
								className="text-gray-600 dark:text-gray-300"
								aria-label="Total Income"
							>
								<span aria-hidden="true">📈</span> Total Income
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
							<Typography
								variant="body1"
								className="text-gray-600 dark:text-gray-300"
								aria-label="Total Expense"
							>
								<span aria-hidden="true">📉</span> Total Expense
							</Typography>
						}
					/>
					<CardContent>
						<Typography variant="h5" className="font-semibold text-red-600 dark:text-red-400">
							{totalExpense.toFixed(2)}
						</Typography>
					</CardContent>
				</Card>
			</Box>

			<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
				<CardHeader
					title={
						<Typography variant="h6" className="font-semibold text-gray-800 dark:text-gray-100">
							Income vs Expense (Last 6 Months)
						</Typography>
					}
				/>
				<CardContent className="flex justify-center">
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
					<List disablePadding>
						{transactions.slice(0, 8).map((t: TransactionData) => (
							<ListItem key={t.id} divider className="flex items-center justify-between py-1.5">
								<ListItemText
									primary={
										<Typography variant="body2" fontWeight="medium">
											{t.title}
										</Typography>
									}
									secondary={
										<Box className="flex items-center gap-1">
											<Typography variant="body2" color="text.secondary">
												{t.category || "Uncategorized"}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												•
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{format(parseISO(t.date), "dd MMM yyyy", { locale: dateFnsLocale })}
											</Typography>
										</Box>
									}
								/>

								<Typography
									variant="body2"
									className={clsx([
										"font-semibold",
										t.type === "EXPENSE"
											? "text-red-600 dark:text-red-400"
											: "text-green-600 dark:text-green-400",
									])}
								>
									{Number(t.amount).toFixed(2)}
								</Typography>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Box>
	);
};

export default Dashboard;
