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
				<Typography role="alert" color="error">
					Failed to load dashboard data. Please try again.
				</Typography>
			</Box>
		);
	}

	const transactions: TransactionData[] = data?.content ?? [];

	const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + Number(t.amount), 0);
	const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + Number(t.amount), 0);
	const balance = totalIncome - totalExpense;

	return (
		<Box className="h-full overflow-auto" tabIndex={0}>
			<Box className="space-y-6 p-4 text-gray-900 dark:text-gray-100">
				<Typography variant="h4" component="h1" className="font-bold text-gray-800 dark:text-gray-100">
					Dashboard
				</Typography>

				<Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
						<CardHeader
							title={
								<Typography
									variant="body1"
									component="h2"
									className="text-gray-900 dark:text-gray-100"
									aria-label="Balance"
								>
									<span aria-hidden="true">💰</span> Balance
								</Typography>
							}
						/>
						<CardContent>
							<Typography variant="h5" component="h3" className="font-semibold">
								{balance.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>

					<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
						<CardHeader
							title={
								<Typography
									variant="body1"
									component="h2"
									className="text-gray-900 dark:text-gray-100"
									aria-label="Total Income"
								>
									<span aria-hidden="true">📈</span> Total Income
								</Typography>
							}
						/>
						<CardContent>
							<Typography
								variant="h5"
								component="h3"
								className="font-semibold text-green-600 dark:text-green-400"
							>
								{totalIncome.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>

					<Card elevation={3} className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
						<CardHeader
							title={
								<Typography
									variant="body1"
									component="h2"
									className="text-gray-900 dark:text-gray-100"
									aria-label="Total Expense"
								>
									<span aria-hidden="true">📉</span> Total Expense
								</Typography>
							}
						/>
						<CardContent>
							<Typography
								variant="h5"
								component="h3"
								className="font-semibold text-red-600 dark:text-red-400"
							>
								{totalExpense.toFixed(2)}
							</Typography>
						</CardContent>
					</Card>
				</Box>

				<Box className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
								<Typography
									variant="h6"
									component="h2"
									className="font-semibold text-gray-900 dark:text-gray-100"
								>
									Recent Transactions
								</Typography>
							}
						/>
						<CardContent>
							<List>
								{transactions.slice(0, 5).map((transaction) => (
									<ListItem key={transaction.id} divider className="px-0">
										<ListItemText
											primary={transaction.title}
											secondary={`${format(parseISO(transaction.date), "MMM d, yyyy", { locale: dateFnsLocale })} • ${transaction.category || "Uncategorized"}`}
											slotProps={{
												primary: {
													className: "font-medium dark:text-gray-100",
												},
												secondary: {
													className: "dark:text-gray-400",
												},
											}}
										/>
										<Typography
											className={clsx(
												"font-bold",
												transaction.type === "EXPENSE"
													? "text-red-600 dark:text-red-400"
													: "text-green-600 dark:text-green-400",
											)}
										>
											{transaction.type === "INCOME" ? "+" : "-"}
											{Number(transaction.amount).toFixed(2)}
										</Typography>
									</ListItem>
								))}
								{transactions.length === 0 && (
									<ListItem>
										<ListItemText
											primary="No recent transactions found"
											slotProps={{
												primary: {
													className: "text-center text-gray-500 dark:text-gray-400",
													variant: "body2",
												},
											}}
										/>
									</ListItem>
								)}
							</List>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
