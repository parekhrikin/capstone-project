

import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginCustomer, loginStaff } from './authActions';

const initialState = {
    loading: false,
    user: null,
    userInfo: null,
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
    authenticated: false // for tracking authentication state
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated(state, action) {
            state.authenticated = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        setUser(state, action) {
          state.user = action.payload
        },
        setUserToken(state, action) {
          state.userToken = action.payload
        },
        resetAuthState(state) {
            // Reset state to initial values
            Object.assign(state, initialState);
        },
    },
    extraReducers: {
        // register user
        [registerUser.pending]: (state) => {
          state.loading = true
          state.error = null
        },
        [registerUser.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.success = true // registration successful
            state.authenticated = true; // set authenticated as true on successful registration
        },
        [registerUser.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
        [loginStaff.pending]: (state) => {
          state.loading = true
          state.error = null
        },
        [loginStaff.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.success = true // login successful
            state.authenticated = true; // set authenticated as true on successful login
            state.userToken = payload.token;
        },
        [loginStaff.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
        [loginCustomer.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        [loginCustomer.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.success = true // login successful
            state.authenticated = true; // set authenticated as true on successful login
            state.userToken = payload.token;
        },
        [loginCustomer.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
});

export const { setAuthenticated, setUserInfo, setUser, setUserToken, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
