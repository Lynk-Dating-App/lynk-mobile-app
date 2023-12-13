import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import subscriptionReducer from "./subscriptionReducer";

const rootReducer = combineReducers({
    authReducer,
    userReducer,
    subscriptionReducer
});

export default rootReducer;