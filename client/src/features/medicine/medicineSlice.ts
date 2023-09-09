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
    photo: string,
    pharmacy_id: string,
    description: string,
    strength: string,
    available: boolean,
    category: string,       
    price: number,   
    manufacturer:string,
    expiry_date:Date,
}

export interface MedicineDataType {
    name: string,
    strength: string,
    category: string,
    description:string,
    price: string,
    photo: string,
    manufacturer: string,
    expiry_date: string
}

export interface Patient {
    _id: string,
    user_id: UserInfo
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
    gender: string,
    blood_type: string,
    date_of_birth: Date,
    height: string,
    weight: string
}

export interface getMedicineType {
    data: Medicine[],
    currentPage: number,
    numOfPages: number
}

interface MedicineState {
    medicine: getMedicineType | null,
    status: 'idle' | 'loading' |'failed' | '',
    message: string
}

const initialState: MedicineState = {
    medicine: null,
    status: '',
    message: ''
}


export const getMedicine = createAsyncThunk<
    getMedicineType,
    {page?: number, searchQuery?:string, category?: string},
    {state: RootState}
>("medicine/get",async ({page, searchQuery, category}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser?.token as string | undefined;
        const safeToken = token ||'';
        return await medicineService.getAllMedicine(safeToken, page, searchQuery, category)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }
})

export const addNewMedicine = createAsyncThunk<
    Medicine,
    MedicineDataType,
    {state: RootState}
>("medicine/post",async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser?.token as string | undefined;
        const safeToken = token ||'';
        return await medicineService.addMedicine(safeToken, data)
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

        .addCase(addNewMedicine.rejected, (state, action) => {
            state.status = 'failed'
            state.message = action.payload as string
        })
        .addCase(addNewMedicine.fulfilled, (state, action) => {
            state.medicine?.data.push(action.payload)
            state.status = 'idle'
        })
        .addCase(addNewMedicine.pending, (state) => {
            state.status = 'loading'
        })

        .addCase(getMedicine.rejected, (state, action) => {
            state.status = 'failed'
            console.log(action.payload)
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