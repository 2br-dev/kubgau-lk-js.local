import { MenuRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import "./styles.scss";
import TeacherMenu from "../teacher_menu";
import CathedraMenu from "../cathedra_menu";
import React from "react";
import DekanMenu from "../dekan_menu";
import UMUMenu from "../umu_menu";

const UserMenu = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
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
		role: "stranger",
		logged: false,
	};

	let menu = (
		<Button variant="text">
			<span className="username">Anonymus</span>
			<MenuRounded />
		</Button>
	);

	const userMenu = () => {
		switch (user.role) {
			case "umu":
				return (
					<UMUMenu
						open={open}
						anchorEl={anchorEl}
						handleClose={handleClose}
					/>
				);
			case "dekan":
				return (
					<DekanMenu
						open={open}
						anchorEl={anchorEl}
						handleClose={handleClose}
					/>
				);
			case "teacher":
				return (
					<TeacherMenu
						open={open}
						anchorEl={anchorEl}
						handleClose={handleClose}
					/>
				);
			case "cathedra":
				return (
					<CathedraMenu
						open={open}
						anchorEl={anchorEl}
						handleClose={handleClose}
					/>
				);
			default:
				return <></>;
		}
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
				{userMenu()}
			</>
		);
	}

	return <div className="menu-wrapper right-align">{menu}</div>;
};

export default UserMenu;
