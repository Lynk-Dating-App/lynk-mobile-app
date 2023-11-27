import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    authReducer,
    userReducer
});

export default rootReducer;