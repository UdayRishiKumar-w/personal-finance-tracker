import { Box, Button, TextField } from "@mui/material";
import clsx from "clsx/lite";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, signup } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthForm() {
	const dispatch = useDispatch();
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [err, setErr] = useState("");

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setFirstName("");
		setLastName("");
		setErr("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErr("");

		// === VALIDATIONS ===
		if (!validateEmail(email)) return setErr("Invalid email format");

		if (!isLogin) {
			if (password.length < 10) return setErr("Password must be at least 10 characters");
			if (!firstName.trim()) return setErr("First name is required");
			if (!lastName.trim()) return setErr("Last name is required");
		}

		try {
			if (isLogin) {
				const data = await login({ email, password });
				if (data) {
					dispatch(setCredentials({ token: data.accessToken, user: data.user }));
				}
			} else {
				const data = await signup({ email, password, firstName, lastName });
				if (data) {
					dispatch(setCredentials({ token: data.accessToken, user: data.user }));
				}
			}
			resetForm();
		} catch (err) {
			setErr((err as Error).message || "Authentication failed");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-white">
			<form onSubmit={handleSubmit} className={clsx("w-full max-w-md rounded p-8 shadow-2xl")}>
				<h2 className="mb-6 text-center text-2xl font-bold text-black">{isLogin ? "Login" : "Sign Up"}</h2>

				{err && <div className="mb-4 text-red-600">{err}</div>}

				<Box className="mb-4 space-y-4">
					{!isLogin && (
						<Box className="flex gap-4">
							<TextField
								required
								id="outlined-required"
								label="First Name"
								variant="outlined"
								fullWidth
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<TextField
								required
								id="outlined-required"
								label="Last Name"
								variant="outlined"
								fullWidth
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</Box>
					)}

					<Box>
						<TextField
							required
							id="outlined-required"
							label="Email"
							type="email"
							variant="outlined"
							fullWidth
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Box>

					<Box>
						<TextField
							required
							id="outlined-required"
							label="Password"
							type="password"
							variant="outlined"
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Box>
				</Box>

				<Button variant="contained" color="primary" fullWidth type="submit" className="mb-4">
					{isLogin ? "Login" : "Sign Up"}
				</Button>

				<div className="text-center text-sm text-black">
					{isLogin ? (
						<>
							Don't have an account?{" "}
							<Button
								type="button"
								variant="text"
								onClick={() => setIsLogin(false)}
								className="underline"
							>
								Sign Up
							</Button>
						</>
					) : (
						<>
							Already have an account?{" "}
							<Button type="button" variant="text" onClick={() => setIsLogin(true)} className="underline">
								Login
							</Button>
						</>
					)}
				</div>
			</form>
		</div>
	);
}
