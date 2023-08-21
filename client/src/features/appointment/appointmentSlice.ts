import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import appointmentService from "./appointmentService"
import { RootState } from "../../app/store"

export interface MakeAppointmentData {
    doctor_id: string,
    reason: string,
    appointment_date: Date
}

export interface editObject {
    appointment_date?: Date,
    reason?: string
}

interface Pharmacy {
    user_id: UserInfo,
    name: string,
    address: string,   
    description: string,
    phone_number: string,       
    working_hours: string,  
}

interface Medicine {
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

export interface Appointment {
    _id: string,
    doctor_id: doctor_id,
    patient_id: string,
    diagnose: string,
    therapy: Medicine[],
    other_medicine: string,
    description: string,
    reason: string,
    finished: boolean,
    notification: boolean,
    appointment_date: Date
}

export interface AppointmentState {
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

export const editAppointment = createAsyncThunk("appointment/patch",async ({id, editObjectData}: {id: string, editObjectData: editObject}, thunkAPI) => {
    try {
        return await appointmentService.editAppointment(id, editObjectData)
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

export const cancelAppointment = createAsyncThunk("appointment/delete",async (id: string, thunkAPI) => {
    try {
        return await appointmentService.deleteAppointment(id)
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
            .addCase(cancelAppointment.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.status = 'idle',
                state.personAppointments = state.personAppointments.filter((n) => n._id !== action.payload._id)
                state.selectedAppointment = null
            })
            .addCase(editAppointment.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(editAppointment.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(editAppointment.fulfilled, (state, action) => {
                const i = state.personAppointments.findIndex(el => el._id === action.payload._id)
                if(i !== -1) state.personAppointments[i] = action.payload
                state.status = 'idle'
            })
 
    }
})

export const appointment = (state: RootState) => state.appointment;

export const {reset, resetAppointmentDay, resetPersonAppointment, resetSelectedAppointment} = appointmentSlice.actions
export default appointmentSlice.reducer;