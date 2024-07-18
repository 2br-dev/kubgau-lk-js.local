import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

import semesterReducer from './semester/semester-reducer';
import userReducer from "./user/user-reducer";

/** Инициализация Redux */

const reducer = combineReducers([
	// add reducers here
	semesterReducer, //Редюсер семестров
	userReducer //Редюсер пользователя
])


const store = configureStore({
	reducer: reducer
})

export default store;