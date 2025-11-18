import { useSignUpMutation } from "@/api/authApi";
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

const createSignupSchema = (t: TFunction<"translation", undefined>) =>
	z.object({
		firstName: z
			.string()
			.trim()
			.min(1, { error: t("firstNameRequired") }),
		lastName: z
			.string()
			.trim()
			.min(1, { error: t("lastNameRequired") }),
		email: z.email({ error: t("invalidEmail") }).transform((val) => val.trim()),
		password: z
			.string()
			.trim()
			.min(10, { error: t("passwordMinRequired") })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
				error: t("passwordComplexity"),
			}),
	});

type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;

const Signup: FC = () => {
	const { mutateAsync: signup, isPending } = useSignUpMutation();
	const dispatch = useDispatch();
	const { t, i18n } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const {
		register,
		handleSubmit,
		setFocus,
		reset,
		trigger,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(createSignupSchema(t)),
		mode: "onBlur",
		shouldFocusError: true,
	});

	useEffect(() => {
		const erroredFields = Object.keys(errors) as (keyof SignupFormData)[];

		reset(
			{},
			{
				keepValues: true,
				keepErrors: true,
			},
		);
		void trigger(erroredFields);
	}, [i18n.language, reset, trigger, errors]);

	useEffect(() => {
		setFocus("firstName");
	}, [setFocus]);

	const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
		try {
			await signup(data);
			reset();
		} catch (err) {
			dispatch(showSnackbar({ message: (err as Error).message, severity: "error" }));
			console.error(err);
		}
	};

	return (
		<>
			<Box className="flex h-full items-center justify-center overflow-auto">
				<form
					onSubmit={() => {
						void handleSubmit(onSubmit);
					}}
					className="w-full max-w-xs rounded-lg p-8 shadow-2xl sm:max-w-md dark:shadow-neutral-50"
					noValidate
				>
					<Typography variant="h2" className="mb-6 text-center text-2xl font-bold">
						{t("signup")}
					</Typography>

					<Box className="mb-4 flex flex-col gap-4 sm:flex-row">
						<TextField
							required
							label={t("firstName")}
							variant="outlined"
							fullWidth
							autoComplete="given-name"
							{...register("firstName")}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
							slotProps={{
								htmlInput: {
									title: t("enterFirstName"),
								},
							}}
						/>
						<TextField
							required
							label={t("lastName")}
							variant="outlined"
							fullWidth
							autoComplete="family-name"
							{...register("lastName")}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
							slotProps={{
								htmlInput: {
									title: t("enterLastName"),
								},
							}}
						/>
					</Box>

					<Box className="mb-4 flex flex-col gap-4">
						<TextField
							required
							label={t("email")}
							type="email"
							variant="outlined"
							fullWidth
							autoComplete="username"
							{...register("email")}
							error={!!errors.email}
							helperText={errors.email?.message}
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
							autoComplete="new-password"
							{...register("password")}
							error={!!errors.password}
							helperText={errors.password?.message}
							slotProps={{
								htmlInput: {
									minLength: 10,
									title: t("passwordComplexity"),
								},
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={togglePasswordVisibility}
												onMouseDown={(e) => {
													e.preventDefault();
												}}
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

					<Button variant="contained" color="primary" fullWidth type="submit" disabled={isPending}>
						{t("signup")}
					</Button>

					<Stack
						direction="row"
						justifyContent="center"
						alignItems="center"
						className="mt-2 text-center text-sm"
					>
						<Typography variant="body2" component="span">
							{t("alreadyHaveAccount")}
						</Typography>

						<Link component={RouterLink} to="/login" className="ms-1.5">
							{t("login")}
						</Link>
					</Stack>
				</form>
			</Box>

			{isPending && <Loader text={`${t("signingUp")}...`} />}
		</>
	);
};

export default Signup;
