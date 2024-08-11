import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import logo from "./img/logo.svg";
import Semester from "./components/semester";
import { Link } from "react-router-dom";
import { SupportRounded } from "@mui/icons-material";
import UserMenu from "./components/user_menu";
import NavbarInfo, { EType } from "./components/navbar_info";
import "./styles.scss";

const Navbar = () => {
	return (
		<>
			<header className="screen">
				<div className="container">
					<Grid container spacing={2}>
						<Grid lg={8} md={8} sm={7} xs={9}>
							<div className="menu-wrapper">
								<div className="logo-wrapper">
									<img src={logo} alt="Логотип" />
								</div>
								<Semester />
								<Link
									to="/help"
									className="link iconic-link help"
								>
									<SupportRounded
										sx={{ marginRight: "10px" }}
									/>
									Помощь
								</Link>
							</div>
						</Grid>
						<Grid lg={4} md={4} sm={5} xs={3}>
							<UserMenu />
						</Grid>
					</Grid>
				</div>
			</header>
			<NavbarInfo
				type={EType.INFO}
				message="Коллектор статистики не включён."
			/>
		</>
	);
};

export default Navbar;
