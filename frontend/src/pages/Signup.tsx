import { useSignUpMutation } from "@/api/authApi";
import Loader from "@/components/common/Loader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import type { FC, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string): boolean => {
	const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
	return pattern.test(password);
};

const Signup: FC = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const { mutateAsync: signup, isPending } = useSignUpMutation();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErr("");

		try {
			const trimmedFirstName = firstName.trim();
			const trimmedLastName = lastName.trim();
			const trimmedEmail = email.trim();
			const trimmedPassword = password.trim();
			setFirstName(trimmedFirstName);
			setLastName(trimmedLastName);
			setEmail(trimmedEmail);
			setPassword(trimmedPassword);
			if (!trimmedFirstName) return setErr("First name is required");
			if (!trimmedLastName) return setErr("Last name is required");
			if (!validateEmail(trimmedEmail)) return setErr("Invalid email format");
			if (trimmedPassword.length < 10) return setErr("Password must be at least 10 characters");
			if (!validatePassword(trimmedPassword))
				return setErr(
					"Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
				);

			await signup({
				firstName: trimmedFirstName,
				lastName: trimmedLastName,
				email: trimmedEmail,
				password: trimmedPassword,
			});
		} catch (err) {
			setErr((err as Error).message || "Signup failed");
		}
	};

	return (
		<>
			<div className="flex h-full items-center justify-center">
				<form onSubmit={handleSubmit} className="w-full max-w-md rounded p-8 shadow-2xl dark:shadow-neutral-50">
					<h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>

					{err && <div className="mb-4 text-red-600">{err}</div>}

					<Box className="mb-4 flex gap-4">
						<TextField
							required
							label="First Name"
							variant="outlined"
							fullWidth
							value={firstName}
							inputRef={inputRef}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<TextField
							required
							label="Last Name"
							variant="outlined"
							fullWidth
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</Box>

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

					<Button
						variant="contained"
						color="primary"
						fullWidth
						type="submit"
						className="mb-4"
						disabled={isPending}
					>
						Sign Up
					</Button>

					<div className="text-center text-sm">
						Already have an account?{" "}
						<Link component={RouterLink} to="/login">
							Login
						</Link>
					</div>
				</form>
			</div>

			{isPending && <Loader text="Signing up..." />}
		</>
	);
};

export default Signup;
