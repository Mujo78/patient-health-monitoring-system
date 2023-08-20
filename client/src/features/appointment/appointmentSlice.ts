import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import appointmentService from "./appointmentService"
import { RootState } from "../../app/store"

export interface MakeAppointmentData {
    doctor_id: string,
    reason: string,
    appointment_date: Date
}

export interface UserInfo {
    _id: string,
    photo: string,
    email: string
}

interface doctor_id {
    _id: string,
    first_name: string,
    last_name: string,
    speciality: string,
    qualification: string,
    bio: string,
    age: string,
    user_id : UserInfo
}

interface Appointment {
    _id: string,
    doctor_id: doctor_id,
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
    selectedAppointment: Appointment | null,
    personAppointments: Appointment[],
    selectedDayAppointments: Appointment[],
    status: 'idle' | 'loading' |'failed' | '',
    message: string
}

const initialState: AppointmentState = {
    selectedAppointment: null,
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

export const getAppointmentsForPerson = createAsyncThunk("appointments/get",async (_, thunkAPI) => {
    try {
        return await appointmentService.getAppointmentForPerson()
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const getSelectedAppointment = createAsyncThunk("appointment/get",async (id: string, thunkAPI) => {
    try {
        return await appointmentService.getAppointment(id)
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
            state.status = '',
            state.message = ''
        },
        resetPersonAppointment: (state) =>{
            state.personAppointments = []
        },
        resetSelectedAppointment: (state) =>{
            state.selectedAppointment = null
        }
    },
    extraReducers: (builder) =>{
        builder
            .addCase(bookAppointment.rejected, (state, action) => {
                state.status = 'failed'
                state.message = action.payload as string
            })
            .addCase(bookAppointment.fulfilled, (state) => {
                state.status = 'idle'
            })
            .addCase(getAppointmentsForPerson.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getAppointmentsForPerson.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(getAppointmentsForPerson.fulfilled, (state, action) => {
                state.status = 'idle',
                state.personAppointments = action.payload
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
            .addCase(getSelectedAppointment.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getSelectedAppointment.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(getSelectedAppointment.fulfilled, (state, action) => {
                state.status = 'idle',
                state.selectedAppointment = action.payload
            })
 
    }
})

export const appointment = (state: RootState) => state.appointment;

export const {reset, resetAppointmentDay, resetPersonAppointment, resetSelectedAppointment} = appointmentSlice.actions
export default appointmentSlice.reducer;