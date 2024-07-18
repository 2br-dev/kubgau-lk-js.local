import store from "../../../../store"
import { MenuRounded } from "@mui/icons-material"
import { Menu, MenuItem, Divider, Button } from "@mui/material"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./styles.scss"

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  let loggedUser = localStorage.getItem("loggedUser")
  let user = {
    fullname: "Anonymus",
    login: "",
    logged: false
  }

  let menu = (
    <Button variant="text">
      Anonymus <MenuRounded />
    </Button>
  )

  const handleLogout = () => {
    localStorage.removeItem("loggedUser")
    store.dispatch({ type: "LOGOUT" })
    navigate("/")
  }

  if (loggedUser) {
    user = JSON.parse(loggedUser)

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
          {user.fullname} ({user.login}){" "}
          <MenuRounded sx={{ marginLeft: "10px" }} />
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to={"/main/courses"}>Главная страница</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={"/main/admin"}>Админ-панель</Link>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <Link to={"/main/statements"}>Мои ведомости</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={"/main/statements_practics"}>
              Мои ведомости по практикам
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={"/main/attestation_lists"}>Аттестационные листы</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={"/main/portfolio"}>Портфолио студента</Link>
          </MenuItem>
          <Divider />
          <MenuItem>Сменить пользователя</MenuItem>
          <MenuItem>Сменить пароль</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Выход</MenuItem>
        </Menu>
      </>
    )
  }

  return <div className="menu-wrapper right-align">{menu}</div>
}

export default UserMenu
