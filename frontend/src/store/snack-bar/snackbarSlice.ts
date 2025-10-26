import type { SnackbarState } from "@/types/storeTypes";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackbarState = {
	open: false,
	message: "",
	severity: "info",
};

const snackbarSlice = createSlice({
	name: "snackbar",
	initialState,
	reducers: {
		showSnackbar: (state, action: PayloadAction<{ message: string; severity?: SnackbarState["severity"] }>) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = action.payload.severity || "info";
		},
		hideSnackbar: (state) => {
			state.open = false;
			state.message = "";
		},
	},
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
