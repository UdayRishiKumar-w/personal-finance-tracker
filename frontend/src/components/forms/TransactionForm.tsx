import { useCreateTransaction, useUpdateTransaction } from "@/api/transactionsApi";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import type { TransactionData } from "@/types/globalTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useEffect, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as z from "zod";

const transactionSchema = z.object({
	title: z.string().min(1, "Title is required"),
	type: z.enum(["INCOME", "EXPENSE"]),
	category: z.string().min(1, "Category is required"),
	amount: z.preprocess(Number, z.number().positive("Amount must be positive")),
	date: z.string().min(1, "Date is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
	open: boolean;
	onClose: () => void;
	editTransaction?: TransactionData | null;
}

const TransactionForm: FC<TransactionFormProps> = ({ open, onClose, editTransaction }) => {
	const { mutateAsync: createTx } = useCreateTransaction();
	const { mutateAsync: updateTx } = useUpdateTransaction();

	const transactionFormDefaultValues: TransactionFormValues = {
		title: "",
		type: "EXPENSE",
		category: "",
		amount: 0,
		date: new Date().toISOString().split("T")[0],
	};

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<TransactionFormValues>({
		resolver: zodResolver(transactionSchema),
		defaultValues: { ...transactionFormDefaultValues },
		shouldFocusError: true,
	});

	useEffect(() => {
		if (open && editTransaction) {
			reset({
				title: editTransaction.title,
				type: editTransaction.type,
				category: editTransaction.category,
				amount: editTransaction.amount,
				date: editTransaction.date.split("T")[0],
			});
		} else if (!open) {
			reset({ ...transactionFormDefaultValues });
		}
	}, [open, editTransaction, reset]);

	const dispatch = useDispatch();

	const onSubmit: SubmitHandler<TransactionFormValues> = async (values) => {
		try {
			if (editTransaction) {
				if (!editTransaction.id) {
					dispatch(
						showSnackbar({ message: "Cannot update transaction without valid ID", severity: "error" }),
					);
					return;
				}
				await updateTx({ id: editTransaction.id, payload: values });
			} else {
				await createTx(values);
			}
			onClose();
		} catch {
			dispatch(showSnackbar({ message: "Transaction submission failed", severity: "error" }));
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>{editTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>

			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent className="space-y-4">
					<TextField
						required
						fullWidth
						label="Title"
						{...register("title")}
						error={!!errors.title}
						helperText={errors.title?.message}
					/>

					<Controller
						name="type"
						control={control}
						defaultValue="EXPENSE"
						render={({ field }) => (
							<TextField select fullWidth required label="Type" {...field}>
								<MenuItem value="INCOME">Income</MenuItem>
								<MenuItem value="EXPENSE">Expense</MenuItem>
							</TextField>
						)}
					/>

					<TextField
						required
						fullWidth
						label="Category"
						{...register("category")}
						error={!!errors.category}
						helperText={errors.category?.message}
					/>

					<TextField
						required
						fullWidth
						label="Amount"
						type="number"
						{...register("amount")}
						error={!!errors.amount}
						helperText={errors.amount?.message}
					/>

					<TextField
						required
						fullWidth
						label="Date"
						type="date"
						{...register("date")}
						slotProps={{
							inputLabel: { shrink: true },
						}}
						error={!!errors.date}
						helperText={errors.date?.message}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button variant="contained" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : editTransaction ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default TransactionForm;
