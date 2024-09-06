import { Menu, MenuItem, Divider } from "@mui/material";
import { Link } from "react-router-dom";
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
			<MenuItem onClick={handleClose} component={Link} to="/main/courses">
				Главная страница
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/main/admin">
				Админ-панель
			</MenuItem>
			<Divider />
			<MenuItem onClick={handleClose} component={Link} to="/">
				Карточка студента
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Карточка группа
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Реестр документов
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Управление пропусками
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Управление аттестациями
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				onClose={handleClose}
				component={Link}
				to="/main/sessions"
			>
				{" "}
				Управление сессиями
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Управление практиками
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Управление пользователями
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/group-curators/"
			>
				Кураторы групп
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Отчёты
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Логины студентов
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/">
				Логины студентов (все факультеты)
			</MenuItem>
			<Divider />
			<MenuItem onClick={handleClose}>Сменить пароль</MenuItem>
			<MenuItem onClick={handleLogout}>Выйти</MenuItem>
		</Menu>
	);
}

export default DekanMenu;
