import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

export default function Login() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await login(email, password);
			dispatch(setCredentials({ token: data.accessToken, user: data.user }));
		} catch (err) {
			setErr((err as Error).message || "Login failed");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<form onSubmit={submit} className="w-96 rounded bg-white p-6 shadow">
				<h2 className="mb-4 text-xl">Sign in</h2>
				{err && <div className="text-red-600">{err}</div>}
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="mb-2 w-full border p-2"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="mb-4 w-full border p-2"
				/>
				<button className="w-full rounded bg-blue-600 py-2 text-white">Login</button>
			</form>
		</div>
	);
}
