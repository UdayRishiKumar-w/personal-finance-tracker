import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
	token: string | null;
	user: { id: string; email: string } | null;
}

const initialState: AuthState = { token: null, user: null };

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials(state, action: PayloadAction<AuthState>) {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		clearCredentials(state) {
			state.token = null;
			state.user = null;
		},
	},
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
