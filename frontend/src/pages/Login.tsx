import { useLoginMutation } from "@/api/authApi";
import Loader from "@/components/common/Loader";
import { showSnackbar } from "@/store/snack-bar/snackbarSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { TFunction } from "i18next";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import * as z from "zod";

const createLoginSchema = (t: TFunction<"translation", undefined>) =>
	z.object({
		email: z.email({ error: t("invalidEmail") }).transform((val) => val.trim()),
		password: z.string().min(1, t("passwordRequired")),
	});

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

const Login: FC = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const { mutateAsync: login, isPending } = useLoginMutation();

	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const {
		register,
		handleSubmit,
		setFocus,
		reset,
		formState: { errors },
		trigger,
	} = useForm<LoginFormData>({
		resolver: zodResolver(createLoginSchema(t)),
		mode: "onBlur",
		shouldFocusError: true,
	});

	useEffect(() => {
		const erroredFields = Object.keys(errors) as (keyof LoginFormData)[];

		reset(
			{},
			{
				keepValues: true,
				keepErrors: true,
			},
		);
		trigger(erroredFields);
	}, [i18n.language, reset, trigger, errors]);

	useEffect(() => {
		setFocus("email");
	}, [setFocus]);

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
		try {
			await login({
				email: data.email.trim(),
				password: data.password,
			});
			dispatch(showSnackbar({ message: "Logged in successfully!", severity: "success" }));
			reset();
		} catch (err) {
			dispatch(showSnackbar({ message: (err as Error).message || "Login failed", severity: "error" }));
			console.error(err);
		}
	};

	return (
		<>
			<Box className="flex h-full items-center justify-center overflow-auto">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-xs rounded-lg p-8 shadow-2xl sm:max-w-md dark:shadow-neutral-50"
					noValidate
				>
					<Typography variant="h2" className="mb-6 text-center text-2xl font-bold">
						{t("login")}
					</Typography>

					<Box className="mb-4 flex flex-col gap-4">
						<TextField
							required
							label={t("email")}
							type="email"
							variant="outlined"
							fullWidth
							autoComplete="username"
							error={!!errors.email}
							helperText={errors.email?.message}
							{...register("email")}
							slotProps={{
								htmlInput: {
									title: t("enterEmail"),
								},
							}}
						/>

						<TextField
							required
							label={t("password")}
							type={showPassword ? "text" : "password"}
							variant="outlined"
							fullWidth
							autoComplete="current-password"
							error={!!errors.password}
							helperText={errors.password?.message}
							{...register("password")}
							slotProps={{
								htmlInput: {
									title: t("enterPassword"),
								},
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={togglePasswordVisibility}
												onMouseDown={(e) => e.preventDefault()}
												edge="end"
												aria-label={showPassword ? "Hide password" : "Show password"}
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								},
							}}
						/>
					</Box>

					<Button type="submit" variant="contained" color="primary" fullWidth disabled={isPending}>
						{t("login")}
					</Button>
					<Stack
						direction="row"
						justifyContent="center"
						alignItems="center"
						className="mt-2 text-center text-sm"
					>
						<Typography variant="body2" component="span">
							{t("dontHaveAccount")}
						</Typography>

						<Link component={RouterLink} to="/signup" className="ml-1.5 rtl:mr-1.5 rtl:ml-0">
							{t("signUp")}
						</Link>
					</Stack>
				</form>
			</Box>
			{isPending && <Loader text={t("loggingIn")} />}
		</>
	);
};

export default Login;
