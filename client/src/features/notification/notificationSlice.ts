import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"


interface notification {
    _id: string,
    user_id: string,
    content: string,
    type: string,
    read: boolean
}

interface initialState {
    notifications: string[]
}

const initialState: initialState = {
    notifications: []
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            console.log(action.payload)
            state.notifications.push(action.payload);
          }
        },
      });
      

export const notification = (state: RootState) => state.notification;
export const {  addNotification } = notificationSlice.actions
export default notificationSlice.reducer;