import { hideSnackbar } from "@/store/snack-bar/snackbarSlice";
import type { RootState } from "@/store/store";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

export const SnackbarProvider: FC = () => {
	const dispatch = useDispatch();
	const { open, message, severity } = useSelector((state: RootState) => state.snackbar);

	return (
		<Snackbar
			open={open}
			autoHideDuration={2000}
			onClose={() => dispatch(hideSnackbar())}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
		>
			<Alert onClose={() => dispatch(hideSnackbar())} severity={severity} variant="filled" className="w-full">
				{message}
			</Alert>
		</Snackbar>
	);
};
