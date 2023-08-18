import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import appointmentService from "./appointmentService"
import { RootState } from "../../app/store"

export interface MakeAppointmentData {
    doctor_id: string,
    reason: string,
    appointment_date: Date
}

interface Appointment {
    doctor_id: string,
    patient_id: string,
    diagnose: string,
    therapy: string,
    other_medicine: string,
    description: string,
    reason: string,
    finished: boolean,
    notification: boolean,
    appointment_date: Date
}

interface AppointmentState {
    personAppointments: Appointment[],
    selectedDayAppointments: Appointment[],
    status: 'idle' | 'loading' |'failed' | '',
    message: string
}

const initialState: AppointmentState = {
    personAppointments: [],
    selectedDayAppointments: [],
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

export const getAppointmentsForADay = createAsyncThunk("appointment-day/get",async (date:Date, thunkAPI) => {
    try {
        return await appointmentService.getAppointmentsForDay(date)
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
        },
        resetAppointmentDay: (state) => {
            state.selectedDayAppointments = []
        }
    },
    extraReducers: (builder) =>{
        builder
            .addCase(bookAppointment.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.status = 'failed'
                state.message = action.payload as string
            })
            .addCase(bookAppointment.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(getAppointmentsForADay.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getAppointmentsForADay.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(getAppointmentsForADay.fulfilled, (state, action) => {
                state.status = 'idle',
                state.selectedDayAppointments = action.payload
            })
 
    }
})

export const appointment = (state: RootState) => state.appointment;

export const {reset, resetAppointmentDay} = appointmentSlice.actions
export default appointmentSlice.reducer;