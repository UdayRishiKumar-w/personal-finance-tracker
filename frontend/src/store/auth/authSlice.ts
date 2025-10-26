import type { AuthState, User } from "@/types/storeTypes";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthenticated: (state, action: PayloadAction<User>) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		setLoggedOut: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
	},
});

export const { setAuthenticated, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
