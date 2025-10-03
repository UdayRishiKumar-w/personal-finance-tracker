import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function TopBar({ onLogout, text }: Readonly<{ onLogout: () => void; text: string }>) {
	return (
		<AppBar position="static" color="default" elevation={0}>
			<Toolbar className="flex justify-between">
				<Typography variant="h6" color="inherit" component="div">
					{text}
				</Typography>

				<IconButton
					edge="end"
					color="inherit"
					aria-label="logout"
					className="mr-5 text-red-600"
					onClick={onLogout}
					title="Logout"
				>
					<span className="material-icons">logout</span>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
