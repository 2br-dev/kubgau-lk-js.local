import React from "react";
import { Link } from "react-router-dom";
import { Divider, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import store from "../../../../store";
import { useNavigate } from "react-router-dom";

UMUMenu.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	anchorEl: PropTypes.any,
};

function UMUMenu(props) {
	const open = Boolean(props.anchorEl);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("loggedUser");
		store.dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<Menu open={open} anchorEl={props.anchorEl} onClose={props.handleClose}>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/umu-dashboard"
			>
				Главная
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/admin-umu"
			>
				Админ-панель
			</MenuItem>
			<Divider />
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/discipline-attachment"
			>
				Привязка дисциплин к кафедрам
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/student-card"
			>
				Карточка студента
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/group-card"
			>
				Карточка группы
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/docs-list"
			>
				Реестр документов
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/sessions"
			>
				Управление сессиями
			</MenuItem>
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/practice-management"
			>
				Управление практиками
			</MenuItem>
			<Divider />
			<MenuItem
				onClick={props.handleClose}
				component={Link}
				to="/main/profile"
			>
				Сменить пароль
			</MenuItem>
			<MenuItem onClick={handleLogout}>Выйти</MenuItem>
		</Menu>
	);
}

export default UMUMenu;
