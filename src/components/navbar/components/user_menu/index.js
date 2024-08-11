import store from "../../../../store";
import { MenuRounded } from "@mui/icons-material";
import { Menu, MenuItem, Divider, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";

const UserMenu = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	let loggedUser = localStorage.getItem("loggedUser");
	let user = {
		fullname: "Anonymus",
		login: "",
		logged: false,
	};

	let menu = (
		<Button variant="text">
			<span className="username">Anonymus</span>
			<MenuRounded />
		</Button>
	);

	const handleLogout = () => {
		localStorage.removeItem("loggedUser");
		store.dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	if (loggedUser) {
		user = JSON.parse(loggedUser);

		menu = (
			<>
				<Button
					variant="text"
					aria-controls={open ? "user-menu" : undefined}
					aria-expanded={open ? "true" : undefined}
					aria-haspopup="true"
					sx={{ marginRight: "0 !important", color: "black" }}
					onClick={handleClick}
				>
					<span className="username">
						{user.fullname} ({user.login}){" "}
					</span>
					<MenuRounded sx={{ marginLeft: "10px" }} />
				</Button>
				<Menu
					id="user-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
				>
					<MenuItem
						onClick={handleClose}
						component={Link}
						to="/main/courses"
					>
						Главная страница
					</MenuItem>
					<MenuItem
						onClick={handleClose}
						component={Link}
						to="/main/admin"
					>
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
						to="/main/statements"
					>
						Мои ведомости
					</MenuItem>
					<MenuItem
						onClick={handleClose}
						component={Link}
						to="/main/statement/practice"
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
			</>
		);
	}

	return <div className="menu-wrapper right-align">{menu}</div>;
};

export default UserMenu;
