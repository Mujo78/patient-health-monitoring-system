import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import appointmentService from "./appointmentService"
import { RootState } from "../../app/store"
import { Medicine } from "../medicine/medicineSlice"

export interface MakeAppointmentData {
    doctor_id: string,
    reason: string,
    appointment_date: Date
}

export interface finishAppointmentObj {
    other_medicine?: string,
    description?: string,
    diagnose?: string,
    therapy?: string[],
    finished: boolean
}


export interface editObject {
    appointment_date?: Date,
    reason?: string
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
    user_id : UserInfo,
    available_days: string[]
}
export interface patient_id {
    blood_type: string,
    date_of_birth: Date,
    first_name: string, 
    gender: string,
    height: string,
    last_name: string,
    user_id: UserInfo,
    weight:string,
    address: string,
    _id: string
}

export interface Appointment {
    _id: string,
    doctor_id: doctor_id,
    patient_id: patient_id,
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

export const bookAppointment = createAsyncThunk<
    Appointment,
    MakeAppointmentData,
    {state: RootState}
>
("appointment/post",async (appointmentData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.makeAppointment(appointmentData, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const editAppointment = createAsyncThunk<
        Appointment,
        {id: string, editObjectData: editObject},
        {state: RootState}
        >
("appointment/patch",async ({id, editObjectData}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.editAppointment(id, editObjectData, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})


export const makeAppointmentFinished = createAsyncThunk<
        Appointment,
        {id: string, finishAppointment: finishAppointmentObj},
        {state: RootState}
        >
("appointment-finish/patch",async ({id, finishAppointment}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.finishAppointment(id, finishAppointment, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const getAppointmentsForADay = createAsyncThunk<
    Appointment[],
    Date,
    {state: RootState}
>("appointment-day/get",async (date, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.getAppointmentsForDay(date, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const getAppointmentsForPerson = createAsyncThunk<
    Appointment[],
    undefined,
    {state: RootState}
>("appointments/get",async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        const id = thunkAPI.getState().auth.accessUser.data._id
        return await appointmentService.getAppointmentForPerson(id, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const getSelectedAppointment = createAsyncThunk<
    Appointment,
    string,
    {state: RootState}
>("appointment/get",async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.getAppointment(id, token)
    } catch (error: any) {
        console.log(error)
        const message = error.response.data;

        return thunkAPI.rejectWithValue(message)
    }    
})

export const cancelAppointment = createAsyncThunk<
    Appointment,
    string,
    {state: RootState}
>("appointment/delete",async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.accessUser.token;
        return await appointmentService.deleteAppointment(id, token)
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
            .addCase(makeAppointmentFinished.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(makeAppointmentFinished.rejected, (state, action) => {
                state.status = 'failed',
                state.message = action.payload as string
            })
            .addCase(makeAppointmentFinished.fulfilled, (state) => {
                state.status = 'idle'
            })
 
    }
})

export const appointment = (state: RootState) => state.appointment;

export const {reset, resetAppointmentDay, resetPersonAppointment, resetSelectedAppointment} = appointmentSlice.actions
export default appointmentSlice.reducer;