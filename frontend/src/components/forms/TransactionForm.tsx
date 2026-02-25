import { useCreateTransaction, useUpdateTransaction } from "@/api/transactionsApi";
import useGetDateFnsLocale from "@/hooks/useGetDateFnsLocale";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import type { TransactionData } from "@/types/globalTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
	description: z.string(),
	recurring: z.boolean().default(false).nonoptional(),
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
	const dateFnsLocale = useGetDateFnsLocale();

	const transactionFormDefaultValues: TransactionFormValues = {
		title: "",
		type: "EXPENSE",
		category: "",
		amount: 0,
		date: new Date().toISOString().split("T")[0],
		description: "",
		recurring: false,
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
				description: editTransaction.description,
				recurring: editTransaction.recurring,
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
		} catch (e) {
			dispatch(showSnackbar({ message: (e as Error).message, severity: "error" }));
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

					<Controller
						name="date"
						control={control}
						render={({ field }) => (
							<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateFnsLocale}>
								<DatePicker
									label="Date"
									value={field.value ? new Date(field.value) : null}
									onChange={(date) => {
										field.onChange(date?.toISOString().split("T")[0] ?? "");
									}}
									slotProps={{
										textField: {
											fullWidth: true,
											error: !!errors.date,
											helperText: errors.date?.message,
										},
										openPickerButton: {
											sx: { cursor: "pointer" },
										},
									}}
								/>
							</LocalizationProvider>
						)}
					/>

					<TextField label="Description" fullWidth multiline minRows={2} {...register("description")} />
					<Controller
						control={control}
						name="recurring"
						render={({ field }) => (
							<FormControlLabel
								control={<Switch checked={field.value} {...field} />}
								label="Recurring Transaction"
							/>
						)}
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
