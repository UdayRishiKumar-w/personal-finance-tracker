import { useLogout } from "@/api/authApi";
import Loader from "@/components/common/Loader";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import type { FC } from "react";
import { useDispatch } from "react-redux";

const Logout: FC = () => {
	const { mutateAsync: logout, isPending } = useLogout();
	const dispatch = useDispatch();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (e) {
			dispatch(showSnackbar({ message: (e as Error).message, severity: "error" }));
		}
	};

	return (
		<IconButton
			color="inherit"
			disabled={isPending}
			onClick={handleLogout}
			title={isPending ? "Logging out" : "Logout"}
		>
			<LogoutIcon className="text-red-600" />
			{isPending && <Loader />}
		</IconButton>
	);
};

export default Logout;
