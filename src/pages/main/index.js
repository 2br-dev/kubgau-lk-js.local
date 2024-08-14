import Navbar from "../../components/navbar";
import { Outlet } from "react-router-dom";
import "./styles.scss";
import React from "react";

/** Главная страница (оболочка)  */
const MainPage = () => {
	return (
		<>
			<Navbar /> {/** Навигационное меню  */}
			<Outlet /> {/** Вывод страниц */}
		</>
	);
};

export default MainPage;
