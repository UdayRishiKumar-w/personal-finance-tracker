import { useDeleteTransaction, useTransactions } from "@/api/transactionsApi";
import TransactionForm from "@/components/forms/TransactionForm";
import type { TransactionData } from "@/types/globalTypes";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { GridColDef } from "@mui/x-data-grid/";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { format, parseISO } from "date-fns";
import type { FC } from "react";
import { useState } from "react";

const Transactions: FC = () => {
	const [page] = useState(0);
	const [openForm, setOpenForm] = useState(false);
	const [editTx, setEditTx] = useState<TransactionData | null>(null);
	const { data, isLoading } = useTransactions(page, 20);
	const { mutate: deleteTx, isPending: deleting } = useDeleteTransaction();

	const transactions = (data?.content ?? []) as TransactionData[];

	const columns: GridColDef[] = [
		{ field: "title", headerName: "Title", flex: 1, minWidth: 150 },
		{
			field: "type",
			headerName: "Type",
			width: 120,
			renderCell: (params) => (
				<span
					className={
						params.value === "EXPENSE"
							? "font-semibold text-red-600 dark:text-red-400"
							: "font-semibold text-green-600 dark:text-green-400"
					}
				>
					{params.value}
				</span>
			),
		},
		{ field: "category", headerName: "Category", width: 150 },
		{
			field: "date",
			headerName: "Date",
			width: 160,
			valueFormatter: (params: string) => {
				return format(parseISO(params), "dd MMM yyyy");
			},
		},
		{ field: "amount", headerName: "Amount", width: 120 },
		{
			field: "actions",
			headerName: "Actions",
			width: 180,
			sortable: false,
			renderCell: (params) => (
				<div className="flex h-full items-center space-x-2 rtl:space-x-reverse">
					<Button
						variant="outlined"
						size="small"
						onClick={() => {
							setEditTx(params.row);
							setOpenForm(true);
						}}
					>
						Edit
					</Button>
					<Button
						variant="outlined"
						color="error"
						size="small"
						disabled={deleting}
						onClick={() => deleteTx(params.row.id)}
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<div className="flex items-center justify-between">
				<Typography variant="h5" className="font-bold">
					Transactions
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setOpenForm(true)}
					className="rounded-xl"
				>
					Add
				</Button>
			</div>

			<Card className="rounded-2xl bg-white shadow-md dark:bg-gray-800">
				<CardHeader title={<Typography variant="h6">All Transactions</Typography>} />
				<CardContent>
					<div style={{ height: 600, width: "100%" }}>
						<DataGrid
							rows={transactions}
							columns={columns}
							getRowId={(row) => row.id}
							pageSizeOptions={[10, 20, 50]}
							initialState={{
								pagination: { paginationModel: { pageSize: 10 } },
							}}
							sx={{
								"& .MuiDataGrid-cell": { outline: "none" },
								"& .MuiDataGrid-columnHeaders": {
									bgcolor: "background.paper",
								},
							}}
						/>
					</div>
				</CardContent>
			</Card>

			<TransactionForm
				open={openForm}
				onClose={() => {
					setEditTx(null);
					setOpenForm(false);
				}}
				editTransaction={editTx}
			/>
		</div>
	);
};

export default Transactions;
