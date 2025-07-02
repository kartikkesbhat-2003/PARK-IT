import { createSlice } from "@reduxjs/toolkit";

interface IUser {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  isLoggedIn: boolean;
  avatarImage?: string | null;
}

const initalState: IUser = {
  id: null,
  name: null,
  email: null,
  role: null,
  isLoggedIn: localStorage.getItem("userId") ? true : false,
  avatarImage: null,
};

function updateUserRole(state: IUser, action: { payload: string }) {
  state.role = action.payload;
}

function setUserReducer(state: IUser, action: { payload: IUser }) {
  state.id = action.payload.id;
  state.name = action.payload.name;
  state.email = action.payload.email;
  state.role = action.payload.role;
  state.isLoggedIn = true;
  state.avatarImage = action.payload.avatarImage;
}

function resetUserReducer(state: IUser) {
  state.id = null;
  state.name = null;
  state.email = null;
  state.role = null;
  state.isLoggedIn = false;
  state.avatarImage = null;
}
function setUserRoleReducer(state: IUser, action: { payload: string }) {
  state.role = action.payload;
}

const userSlice = createSlice({
  name: "user",
  initialState: initalState,
  reducers: {
    setUserReducer,
    resetUserReducer,
    setUserRoleReducer,
    updateUserRole,
  },
});
export const {
  setUserReducer: setUserAction,
  resetUserReducer: resetUserAction,
  setUserRoleReducer: setUserRoleAction,
  updateUserRole: updateUserRoleAction,
} = userSlice.actions;
export default userSlice.reducer;
