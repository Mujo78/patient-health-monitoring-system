import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import appointmentReducer from "../features/appointment/appointmentSlice"
import medicineReducer from "../features/medicine/medicineSlice"
import notificationReducer from "../features/notification/notificationSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointment: appointmentReducer,
        medicine: medicineReducer,
        notification: notificationReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;