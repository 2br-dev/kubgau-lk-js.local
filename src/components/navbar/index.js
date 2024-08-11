import { Grid } from "@mui/material"
import React from "react"
import logo from "./img/logo.svg"
import Semester from "./components/semester"
import { Link } from "react-router-dom"
import { SupportRounded } from "@mui/icons-material"
import UserMenu from "./components/user_menu"
import NavbarInfo, { EType } from "./components/navbar_info"
import "./styles.scss"

const Navbar = () => {
	return (
		<>
			<header className="screen">
				<div className="container">
					<Grid container spacing={2}>
						<Grid item lg={8} md={8} sm={10} xs={11}>
							<div className="menu-wrapper">
								<div className="logo-wrapper">
									<img src={logo} alt="Логотип" />
								</div>
								<Semester />
								<Link to="/help" className="link iconic-link help">
									<SupportRounded sx={{ marginRight: "10px" }} />
									Помощь
								</Link>
							</div>
						</Grid>
						<Grid item lg={4} md={4} sm={2} xs={1}>
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
	)
}

export default Navbar
