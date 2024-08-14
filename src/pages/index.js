import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";
import React from "react";

const MainScreen = () => {
	return (
		<main>
			{/* Навигационное меню */}
			<Navbar />
			{/* Вывод страниц */}
			<Outlet />
		</main>
	);
};

export default MainScreen;
