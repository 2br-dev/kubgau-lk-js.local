import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

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
