import { useTransactions } from "@/api/transactionsApi";
import TransactionForm from "@/components/forms/TransactionForm";
import ConfirmDeleteDialog from "@/components/transaction/ConfirmDeleteDialog";
import type { TransactionData } from "@/types/globalTypes";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { GridColDef } from "@mui/x-data-grid/";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import type { FC } from "react";
import { useState } from "react";

const Transactions: FC = () => {
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	const [openForm, setOpenForm] = useState(false);
	const [editTx, setEditTx] = useState<TransactionData | null>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const { data, isLoading, error } = useTransactions(paginationModel.page, paginationModel.pageSize);
	const transactions = (data?.content ?? []) as TransactionData[];

	const columns: GridColDef[] = [
		{ field: "title", headerName: "Title", flex: 1, minWidth: 150 },
		{
			field: "type",
			headerName: "Type",
			width: 120,
			renderCell: (params) => (
				<Typography
					variant="body2"
					component="span"
					className={clsx(
						"font-semibold",
						params.value === "EXPENSE"
							? "text-red-600 dark:text-red-400"
							: "text-green-600 dark:text-green-400",
					)}
				>
					{params.value}
				</Typography>
			),
		},
		{ field: "category", headerName: "Category", width: 150 },
		{
			field: "date",
			headerName: "Date",
			width: 160,
			valueFormatter: (value: string) => {
				return value ? format(parseISO(value), "dd MMM yyyy") : "";
			},
		},
		{ field: "amount", headerName: "Amount", width: 120 },
		{
			field: "actions",
			headerName: "Actions",
			width: 180,
			sortable: false,
			renderCell: (params) => (
				<Box className="flex h-full items-center space-x-2">
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
						onClick={() => {
							setDeleteId(params.row.id);
							setOpenDeleteDialog(true);
						}}
					>
						Delete
					</Button>
				</Box>
			),
		},
	];

	if (isLoading) {
		return (
			<Box className="flex h-full items-center justify-center">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="flex h-full items-center justify-center">
				<Typography color="error">Failed to load transactions. Please try again.</Typography>
			</Box>
		);
	}

	return (
		<Box className="space-y-4 p-4">
			<Box className="flex items-center justify-between">
				<Typography variant="h5" className="font-bold">
					Transactions
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => {
						setEditTx(null);
						setOpenForm(true);
					}}
					className="rounded-xl"
				>
					Add
				</Button>
			</Box>

			<Card className="rounded-2xl bg-white shadow-md dark:bg-gray-800">
				<CardHeader title={<Typography variant="h6">All Transactions</Typography>} />
				<CardContent>
					<Box style={{ height: 600, width: "100%" }}>
						<DataGrid
							rows={transactions}
							columns={columns}
							getRowId={(row) => row.id}
							rowCount={data?.totalElements ?? 0}
							paginationMode="server"
							pageSizeOptions={[10, 20, 50]}
							paginationModel={paginationModel}
							onPaginationModelChange={(model) => setPaginationModel(model)}
							disableRowSelectionOnClick
							sx={{
								"& .MuiDataGrid-cell": { outline: "none" },
								"& .MuiDataGrid-columnHeaders": {
									bgcolor: "background.paper",
								},
							}}
						/>
					</Box>
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
			<ConfirmDeleteDialog
				open={openDeleteDialog}
				onClose={() => {
					setDeleteId(null);
					setOpenDeleteDialog(false);
				}}
				deleteId={deleteId}
			/>
		</Box>
	);
};

export default Transactions;
