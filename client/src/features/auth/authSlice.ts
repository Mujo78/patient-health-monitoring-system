import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import authServices from "./authService"
import { RootState } from "../../app/store"


export interface LoginUser {
    email: string,
    password: string
}

interface AuthState {
    accessUser: any,
    status: 'idle' | 'loading' | 'failed',
    message: string
}

const user = localStorage.getItem('user')
const storedObj = user !== null ? JSON.parse(user) : null

const initialState: AuthState = {
    accessUser: storedObj,
    status: 'idle',
    message: ''
}


export const login = createAsyncThunk("/auth/login", async(loginData: LoginUser, thunkAPI) => {
    try {
        return await authServices.login(loginData)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data

        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk("/auth/logout", async(_, thunkAPI) => {
    try{
        return await authServices.logout()
    }catch(error: any){
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.status = 'idle'
        }
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action) =>{
                state.status = 'idle'
                state.accessUser = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed'
                state.accessUser = null;
                state.message = action.payload as string
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessUser = null
            })
    }
})

export const authUser = (state: RootState) => state.auth;

export const {reset} = authSlice.actions
export default authSlice.reducer;