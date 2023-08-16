import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import appointmentService from "./appointmentService"
import { RootState } from "../../app/store"

export interface MakeAppointmentData {
    doctor_id: string,
    reason: string,
    appointment_date: Date
}

interface AppointmentState {
    status: 'idle' | 'loading' |'failed' | '',
    message: string
}

const initialState: AppointmentState = {
    status: '',
    message: ''
}

export const bookAppointment = createAsyncThunk("appointment/post",async (appointmentData:MakeAppointmentData, thunkAPI) => {
    try {
        return await appointmentService.makeAppointment(appointmentData)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})


export const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        reset: (state) => {
            state.status = '',
            state.message = ''
        }
    }
})

export const appointment = (state: RootState) => state.appointment;

export const {reset} = appointmentSlice.actions
export default appointmentSlice.reducer;