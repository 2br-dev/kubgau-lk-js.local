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
      <header>
        <div className="container">
          <Grid container spacing={2}>
            <Grid item xl={8} lg={8}>
              <div className="menu-wrapper">
                <img src={logo} alt="Логотип" />
                <Semester />
                <Link to="/help" className="link iconic-link">
                  <SupportRounded sx={{ marginRight: "10px" }} />
                  Помощь
                </Link>
              </div>
            </Grid>
            <Grid item xl={4} lg={4}>
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
