import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import notificationServices from "./notificationService";

export interface Notification {
  _id: string;
  name: string;
  user_id: string;
  content: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

interface initialState {
  personNotifications: Notification[];
  oneNotification?: Notification;
  status: "" | "idle" | "failed" | "loading";
  message: string;
}

const initialState: initialState = {
  personNotifications: [],
  status: "",
  message: "",
};

export const getOneNotification = createAsyncThunk<
  Notification,
  string,
  { state: RootState }
>("notification/get", async (id, thunkAPI) => {
  try {
    return await notificationServices.getOneNotification(id);
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const getPersonNotifications = createAsyncThunk<
  Notification[],
  undefined,
  { state: RootState }
>("notifications/get", async (_, thunkAPI) => {
  try {
    return await notificationServices.getAllNotificationsForPerson();
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteAllNotifications = createAsyncThunk<
  string,
  undefined,
  { state: RootState }
>("notifications/delete", async (_, thunkAPI) => {
  try {
    return await notificationServices.deleteAllNotifications();
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteOneNotification = createAsyncThunk<
  Notification,
  string,
  { state: RootState }
>("notification/delete", async (id, thunkAPI) => {
  try {
    return await notificationServices.deleteOneNotification(id);
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const markOneAsRead = createAsyncThunk<
  Notification,
  string,
  { state: RootState }
>("notification/update", async (id, thunkAPI) => {
  try {
    return await notificationServices.markOneNotificationAsRead(id);
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const markAllAsRead = createAsyncThunk<
  Notification[],
  undefined,
  { state: RootState }
>("notifications/update", async (_, thunkAPI) => {
  try {
    return await notificationServices.markAllAsRead();
  } catch (error: any) {
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.personNotifications.unshift(action.payload);
    },
    restartNotifications: (state) => {
      state.personNotifications = [];
    },
    restart: (state) => {
      state.message = "";
      state.status = "";
    },
    restartNotification: (state) => {
      state.oneNotification = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersonNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPersonNotifications.rejected, (state, action) => {
        (state.message = action.payload as string), (state.status = "failed");
      })
      .addCase(getPersonNotifications.fulfilled, (state, action) => {
        state.status = "idle";
        state.personNotifications = action.payload;
      })
      .addCase(getOneNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOneNotification.rejected, (state, action) => {
        (state.message = action.payload as string), (state.status = "failed");
      })
      .addCase(getOneNotification.fulfilled, (state, action) => {
        state.status = "idle";
        state.oneNotification = action.payload;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.personNotifications = action.payload;
        state.status = "idle";
      })
      .addCase(markOneAsRead.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(markOneAsRead.fulfilled, (state, action) => {
        const i = state.personNotifications.findIndex(
          (el) => el._id === action.payload._id,
        );
        if (i !== -1) state.personNotifications[i] = action.payload;
        state.status = "failed";
      })

      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.status = "idle";
        state.personNotifications = [];
      })
      .addCase(deleteAllNotifications.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteOneNotification.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(deleteOneNotification.fulfilled, (state, action) => {
        state.personNotifications = state.personNotifications.filter(
          (el) => el._id !== action.payload._id,
        );
        state.status = "idle";
      });
  },
});

export const notification = (state: RootState) => state.notification;
export const {
  addNotification,
  restartNotifications,
  restartNotification,
  restart,
} = notificationSlice.actions;
export default notificationSlice.reducer;
