import authReducer from "@/store/auth/authSlice";
import snackbarReducer from "@/store/snack-bar/snackbarSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		snackbar: snackbarReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
