import { login } from "@/api/authApi";
import Loader from "@/components/Loader";
import { setCredentials } from "@/store/authSlice";
import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErr("");

		try {
			setLoading(true);
			if (!validateEmail(email)) return setErr("Invalid email format");

			const data = await login({ email, password });
			if (data) {
				const id = Math.random().toString();
				sessionStorage.setItem("token", JSON.stringify(data.accessToken));
				sessionStorage.setItem("user", JSON.stringify({ id, email: data.user.email }));
				dispatch(setCredentials({ token: data.accessToken, user: { id, email: data.user.email } }));
			}
		} catch (err) {
			setErr((err as Error).message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="flex min-h-screen items-center justify-center bg-white">
				<form onSubmit={handleSubmit} className="w-full max-w-md rounded p-8 shadow-2xl">
					<h2 className="mb-6 text-center text-2xl font-bold text-black">Login</h2>

					{err && <div className="mb-4 text-red-600">{err}</div>}

					<Box className="mb-4 space-y-4">
						<TextField
							required
							label="Email"
							type="email"
							variant="outlined"
							fullWidth
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<TextField
							required
							label="Password"
							type="password"
							variant="outlined"
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Box>

					<Button variant="contained" color="primary" fullWidth type="submit" className="mb-4">
						Login
					</Button>

					<div className="text-center text-sm text-black">
						Don't have an account?{" "}
						<Button component={Link} to="/signup" variant="text" className="underline">
							Sign Up
						</Button>
					</div>
				</form>
			</div>
			{loading && <Loader text="Logging in..." />}
		</>
	);
}
