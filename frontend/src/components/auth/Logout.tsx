import { useLogout } from "@/api/authApi";
import Loader from "@/components/common/Loader";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import type { FC } from "react";
import { useDispatch } from "react-redux";

interface LogoutProps {
	"data-testid"?: string;
}

const Logout: FC<LogoutProps> = ({ "data-testid": testId }) => {
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
			onClick={() => {
				void handleLogout();
			}}
			title={isPending ? "Logging out" : "Logout"}
			data-testid={testId}
		>
			<LogoutIcon className="text-red-700" />
			{isPending && <Loader />}
		</IconButton>
	);
};

export default Logout;
