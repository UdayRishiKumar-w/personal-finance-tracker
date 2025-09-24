import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export default function TopBar({ onLogout, text }: Readonly<{ onLogout: () => void; text: string }>) {
	return (
		<AppBar position="static" color="default" elevation={0}>
			<Toolbar className="flex justify-between">
				<Typography variant="h6" color="inherit" component="div">
					{text}
				</Typography>

				<IconButton edge="end" color="inherit" aria-label="logout" className="mr-5 text-red-600" onClick={onLogout} title="Logout">
					<span className="material-icons">logout</span>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
