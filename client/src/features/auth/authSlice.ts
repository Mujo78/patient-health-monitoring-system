import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authServices from "./authService";
import { RootState } from "../../app/store";

export interface LoginUser {
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  role: string;
  photo: string;
  first: boolean;
  isVerified: boolean;
  active: boolean;
  notification: boolean;
}

export interface UpdateUserInterface {
  email?: string;
  notification?: boolean;
  active?: boolean;
}

export interface PatientUser {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  gender: string;
  photo: File;
  blood_type: string;
  date_of_birth: Date;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ResetPassword {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface changePasswordInterface {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PersonUser {
  first_name?: string;
  last_name?: string;
  name?: string;
}

interface accessUserType {
  data: {
    _id: string;
    active: boolean;
    email: string;
    first: boolean;
    isVerified: boolean;
    notification: boolean;
    photo: string;
    role: string;
    createdAt?: Date;
  };
  info: PersonUser;
  token: string;
}

interface AuthState {
  accessUser: accessUserType | null;
  selected?: string;
  status: "idle" | "loading" | "failed" | "";
  message: string;
}

const user = localStorage.getItem("user");
const storedObj = user !== null ? JSON.parse(user) : null;

const initialState: AuthState = {
  accessUser: storedObj,
  selected: "",
  status: "",
  message: "",
};

export const login = createAsyncThunk(
  "/auth/login",
  async (loginData: LoginUser, thunkAPI) => {
    try {
      return await authServices.login(loginData);
    } catch (error: any) {
      console.log(error);
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk<
  accessUserType,
  changePasswordInterface,
  { state: RootState }
>("/auth/update-password", async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessUser?.token as
      | string
      | undefined;
    const safeToken = token || "";
    return await authServices.changeMyPassword(safeToken, data);
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const signup = createAsyncThunk(
  "/auth/signup",
  async (signupData: PatientUser, thunkAPI) => {
    try {
      return await authServices.signup(signupData);
    } catch (error: any) {
      console.log(error);
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyEmailAddress = createAsyncThunk(
  "/auth/verify",
  async (verificationToken: string, thunkAPI) => {
    try {
      return await authServices.verifyEmail(verificationToken);
    } catch (error: any) {
      console.log(error);
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async (ResetPasswordData: ResetPassword, thunkAPI) => {
    try {
      return await authServices.resetPassword(ResetPasswordData);
    } catch (error: any) {
      console.log(error);
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("/auth/logout", async (_, thunkAPI) => {
  try {
    return authServices.logout();
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const updatePicture = createAsyncThunk<
  string,
  File,
  { state: RootState }
>("/user/update-picture", async (photo, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessUser?.token as
      | string
      | undefined;
    const safeToken = token || "";
    return authServices.updatePhoto(safeToken, photo);
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const firstTime = createAsyncThunk<
  boolean,
  undefined,
  { state: RootState }
>("/auth/first-using", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessUser?.token as
      | string
      | undefined;
    const safeToken = token || "";
    return authServices.firstTimeUsing(safeToken);
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  User,
  UpdateUserInterface,
  { state: RootState }
>("/auth/update", async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessUser?.token as string;
    const response = await authServices.updateUser(token, data);
    return response;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const deactivateAccount = createAsyncThunk<
  User,
  { active: boolean },
  { state: RootState }
>("/auth/deactivate", async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessUser?.token as string;
    return authServices.deactivateMyAccount(token, data);
  } catch (error: any) {
    console.log(error);
    const message = error.response.data;

    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      (state.status = ""), (state.message = "");
    },
    resetAccessUser: (state) => {
      state.accessUser = null;
    },
    setInfoAccessUser: (state, action) => {
      if (state.accessUser) {
        state.accessUser.info = action.payload;
      }
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    resetSelected: (state) => {
      state.selected = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.accessUser = null;
        state.message = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.message = action.payload as string;
        state.status = "idle";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(verifyEmailAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyEmailAddress.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(verifyEmailAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessUser = null;
        state.status = "idle";
      })

      .addCase(updatePicture.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(updatePicture.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.accessUser) {
          state.accessUser.data.photo = action.payload as string;
        }
        localStorage.setItem("user", JSON.stringify(state.accessUser));
      })
      .addCase(updatePicture.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.accessUser) {
          state.accessUser.data = action.payload;
          localStorage.setItem("user", JSON.stringify(state.accessUser));
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deactivateAccount.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.accessUser) {
          state.accessUser.data = action.payload;
        }
        localStorage.setItem("user", JSON.stringify(state.accessUser));
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.accessUser) {
          state.accessUser = action.payload;
        }
        localStorage.setItem("user", JSON.stringify(state.accessUser));
      })
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const authUser = (state: RootState) => state.auth;

export const {
  reset,
  resetAccessUser,
  setInfoAccessUser,
  setSelected,
  resetSelected,
} = authSlice.actions;
export default authSlice.reducer;
