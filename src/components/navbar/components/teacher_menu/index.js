import { Menu, MenuItem, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import store from "../../../../store/index";
import PropTypes from "prop-types";

import React from "react";

TeacherMenu.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	anchorEl: PropTypes.any,
};

function TeacherMenu(props) {
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
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/help"
				className="mobile-help"
			>
				Помощь
			</MenuItem>
			<Divider />
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/statements/common"
			>
				Мои ведомости
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/practice-statements"
			>
				Мои ведомости по практикам
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/attestation_lists"
			>
				Аттестационные листы
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/portfolio"
			>
				Портфолио студента
			</MenuItem>
			<Divider />
			<MenuItem>Сменить пользователя</MenuItem>
			<MenuItem>Сменить пароль</MenuItem>
			<Divider />
			<MenuItem onClick={handleLogout}>Выход</MenuItem>
		</Menu>
	);
}

export default TeacherMenu;
