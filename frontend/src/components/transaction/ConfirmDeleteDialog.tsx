import { useDeleteTransaction } from "@/api/transactionsApi";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";

interface ConfirmDeleteDialogProps {
	open: boolean;
	onClose: () => void;
	deleteId: number | null;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, deleteId }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const { mutateAsync: deleteTx, isPending: deleting } = useDeleteTransaction();

	const dispatch = useDispatch();

	const handleDelete = async () => {
		try {
			if (!deleteId) {
				dispatch(showSnackbar({ message: "Cannot delete transaction without valid ID", severity: "error" }));
				return;
			}
			await deleteTx(deleteId);
			onClose();
		} catch {
			dispatch(showSnackbar({ message: "Error occurred while deleting transaction", severity: "error" }));
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen={fullScreen}
			aria-labelledby="confirm-delete-title"
			slotProps={{
				paper: {
					className: "p-1",
				},
			}}
		>
			<DialogTitle id="confirm-delete-title">Delete Transaction</DialogTitle>

			<DialogContent>
				<Typography variant="body1" component="span">
					Do you really want to delete this transaction?{" "}
					<Typography component="span" variant="body1" className="font-medium text-red-600 dark:text-red-400">
						This action cannot be undone.
					</Typography>
				</Typography>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} disabled={deleting}>
					Cancel
				</Button>

				<Button variant="contained" color="error" type="submit" onClick={handleDelete} disabled={deleting}>
					{deleting ? "Deleting..." : "Delete"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDeleteDialog;
