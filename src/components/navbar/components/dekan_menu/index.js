import { Menu, MenuItem, Divider } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import store from "../../../../store";

DekanMenu.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	anchorEl: PropTypes.any,
};

function DekanMenu(props) {
	const open = props.open;
	const handleClose = props.handleClose;
	const anchorEl = props.anchorEl;
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("loggedUser");
		store.dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<Menu
			id="user-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
		>
			<MenuItem>Главная страница</MenuItem>
			<MenuItem>Админ-панель</MenuItem>
			<Divider />
			<MenuItem>Карточка студента</MenuItem>
			<MenuItem>Карточка группа</MenuItem>
			<MenuItem>Реестр документов</MenuItem>
			<MenuItem>Управление пропусками</MenuItem>
			<MenuItem>Управление аттестациями</MenuItem>
			<MenuItem>Управление сессиями</MenuItem>
			<MenuItem>Управление практиками</MenuItem>
			<MenuItem>Управление пользователями</MenuItem>
			<MenuItem>Кураторы групп</MenuItem>
			<MenuItem>Отчёты</MenuItem>
			<MenuItem>Логины студентов</MenuItem>
			<MenuItem>Логины студентов (все факультеты)</MenuItem>
			<Divider />
			<MenuItem>Сменить пароль</MenuItem>
			<MenuItem onClick={handleLogout}>Выйти</MenuItem>
		</Menu>
	);
}

export default DekanMenu;
