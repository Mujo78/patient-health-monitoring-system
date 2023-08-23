import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { UserInfo } from "../appointment/appointmentSlice"
import medicineService from "./medicineService"

export interface Pharmacy {
    user_id: UserInfo,
    name: string,
    address: string,   
    description: string,
    phone_number: string,       
    working_hours: string,  
}

export interface Medicine {
    _id: string,
    name: string,
    pharmacy_id: Pharmacy,
    description: string,
    strength: string,
    category: string,       
    price: number,   
    manufacturer:string,
    expiry_date:Date,
}

interface MedicineState {
    medicine: Medicine[],
    status: 'idle' | 'loading' |'failed' | '',
    message: string
}

const initialState: MedicineState = {
    medicine: [],
    status: '',
    message: ''
}


export const getMedicine = createAsyncThunk<
    Medicine[],
    undefined,
    {state: RootState}
>("medicine/get",async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await medicineService.getAllMedicine(token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})


export const medicineSlice = createSlice({
    name: "medicine",
    initialState,
    reducers: {
        reset: (state) => {
            state.message = '',
            state.status = ''
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getMedicine.rejected, (state, action) => {
            state.status = 'failed'
            state.message = action.payload as string
        })
        .addCase(getMedicine.fulfilled, (state, action) => {
            state.medicine = action.payload
            state.status = 'idle'
        })
        .addCase(getMedicine.pending, (state) => {
            state.status = 'loading'
        })
    }
})

export const medicine = (state: RootState) => state.medicine;

export const {reset} = medicineSlice.actions
export default medicineSlice.reducer;