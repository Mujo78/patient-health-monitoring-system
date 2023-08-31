import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import authServices from "./authService"
import { RootState } from "../../app/store"


export interface LoginUser {
    email: string,
    password: string
}

export interface PatientUser {
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
    gender: string,
    photo: File,
    blood_type: string,
    date_of_birth: Date,
    email: string,
    password: string,
    passwordConfirm: string
}

export interface ResetPassword {
    token: string,
    password: string, 
    passwordConfirm: string
}

interface AuthState {
    accessUser: any,
    status: 'idle' | 'loading' | 'failed' | '',
    message: string
}

const user = localStorage.getItem('user')
const storedObj = user !== null ? JSON.parse(user) : null

const initialState: AuthState = {
    accessUser: storedObj,
    status: '',
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

export const signup = createAsyncThunk("/auth/signup", async(signupData : PatientUser, thunkAPI) => {
    try {
        return await authServices.signup(signupData)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;
        
        return thunkAPI.rejectWithValue(message)
    }
})

export const verifyEmailAddress = createAsyncThunk("/auth/verify",async (verificationToken:string, thunkAPI) => {
    try {
        return await authServices.verifyEmail(verificationToken)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;
        
        return thunkAPI.rejectWithValue(message)
    }    
})

export const resetPassword = createAsyncThunk("/auth/resetPassword",  async(ResetPasswordData: ResetPassword, thunkAPI) => {
    try {
        return await authServices.resetPassword(ResetPasswordData)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk("/auth/logout", async(_, thunkAPI) => {
    try{
        return authServices.logout()
    }catch(error: any){
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }
})

export const firstTime = createAsyncThunk<
    boolean,
    undefined,
    {state: RootState}
>("/auth/first-using", async(_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.accessUser?.token;
        return authServices.firstTimeUsing(token)
    }catch(error: any){
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.status = '',
            state.message = ''
        },
        resetAccessUser: (state) =>{
            state.accessUser = null
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
            .addCase(signup.pending, (state) =>{
                state.status = 'loading'
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed'
                state.message = action.payload as string
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.message = action.payload as string
                state.status = 'idle'
            })
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(resetPassword.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(verifyEmailAddress.pending, (state) =>{
                state.status = 'loading'
            })
            .addCase(verifyEmailAddress.rejected, (state, action) =>{
                state.status = 'failed'
                state.message = action.payload as string
            })
            .addCase(verifyEmailAddress.fulfilled, (state, action) =>{
                state.status = 'idle'
                state.message = action.payload as string
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessUser = null
                state.status = 'idle'
            })
        }
    })

export const authUser = (state: RootState) => state.auth;

export const {reset, resetAccessUser} = authSlice.actions
export default authSlice.reducer;