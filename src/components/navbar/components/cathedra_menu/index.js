import { Menu, MenuItem, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import store from "../../../../store/index";
import React from "react";
import PropTypes from "prop-types";

CathedraMenu.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	anchorEl: PropTypes.node,
};

function CathedraMenu(props) {
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
			<Divider />
			<MenuItem onClick={handleClose} component={Link} to="/main/users/">
				Управление пользователями
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/group-curators/"
			>
				Кураторы групп
			</MenuItem>
			<Divider />
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/orphans/"
			>
				Студенты без сводной группы
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/subgroup-search/"
			>
				Найти подгруппу студента
			</MenuItem>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/comission-access/"
			>
				Допуски по медкомиссии
			</MenuItem>
			<MenuItem onClick={handleClose} component={Link} to="/main/tools/">
				Дополнительные инструменты
			</MenuItem>
			<Divider />
			<MenuItem>Сменить пользователя</MenuItem>
			<MenuItem>Сменить пароль</MenuItem>
			<Divider />
			<MenuItem onClick={handleLogout}>Выход</MenuItem>
		</Menu>
	);
}

export default CathedraMenu;
