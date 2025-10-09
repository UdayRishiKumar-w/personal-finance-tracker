import { useLoginMutation } from "@/api/authApi";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/context/AuthContext";
import { setCredentials } from "@/store/authSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const dispatch = useDispatch();
	const inputRef = useRef<HTMLInputElement>(null);

	const { setIsAuthenticated } = useAuth();
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const { mutateAsync: login, isPending } = useLoginMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErr("");

		try {
			const trimmedEmail = email.trim();
			if (!validateEmail(trimmedEmail)) return setErr("Invalid email format");

			setEmail(trimmedEmail);

			const data = await login({ email: trimmedEmail, password });
			if (data) {
				const id = Math.random().toString();
				sessionStorage.setItem("token", JSON.stringify(data.accessToken));
				sessionStorage.setItem("user", JSON.stringify({ id, email: data.user.email }));
				dispatch(setCredentials({ token: data.accessToken, user: { id, email: data.user.email } }));
				setIsAuthenticated(true);
			}
		} catch (err) {
			setErr((err as Error).message || "Login failed");
		}
	};

	return (
		<>
			<div className="flex h-full items-center justify-center">
				<form onSubmit={handleSubmit} className="w-full max-w-md rounded p-8 shadow-2xl dark:shadow-neutral-50">
					<h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

					{err && <div className="mb-4 text-red-600">{err}</div>}

					<Box className="mb-4 space-y-4">
						<TextField
							required
							label="Email"
							type="email"
							variant="outlined"
							fullWidth
							value={email}
							inputRef={inputRef}
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

					<Button
						variant="contained"
						color="primary"
						fullWidth
						type="submit"
						className="mb-4"
						disabled={isPending}
					>
						Login
					</Button>

					<div className="text-center text-sm">
						Don't have an account?{" "}
						<Link component={RouterLink} to="/signup">
							Sign Up
						</Link>
					</div>
				</form>
			</div>
			{isPending && <Loader text="Logging in..." />}
		</>
	);
}
