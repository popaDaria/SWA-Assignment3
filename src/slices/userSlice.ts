import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
    username: string;
    password: string;
    token?: string;
    userId?: number;
    admin?: boolean;
}

const initialState: UserData = {
    username: '',
    password: '',
    token: undefined,
    userId: 0,
    admin: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: UserData, action: PayloadAction<UserData>) => {
            state = { ...action.payload };
            return state;
        },
        logout: (state: UserData) => {
            state = { ...initialState };
            return state;
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;