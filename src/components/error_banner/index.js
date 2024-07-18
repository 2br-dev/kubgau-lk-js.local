import { Button, Menu, MenuItem } from "@mui/material"
import React, { useState } from "react"
import "./styles.scss"

function ErrorBanner(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = e => {
    let el = e.currentTarget
    let text = el.textContent
    props.errorCallback?.(text)
    setAnchorEl(null)
  }

  let errorList = [...props.errors]

  let menu = (
    <Menu
      id="errors"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: "top"
      }}
    >
      {errorList.map((value, index) => {
        return (
          <MenuItem key={index} onClick={handleMenuClick}>
            {value}
          </MenuItem>
        )
      })}
    </Menu>
  )

  return (
    <div className="banner error">
      <div className="message">
        <p>{props.message}</p>
      </div>
      <div className="actions">
        <Button
          variant="text"
          aria-controls={open ? "errors" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          sx={{
            marginRight: "0 !important",
            backgroundColor: "#ffffffcc",
            color: "#FF1744",
            "&:hover": {
              backgroundColor: "#ffffffff"
            }
          }}
          onClick={handleClick}
        >
          {props.errorsTitle}
        </Button>
        {menu}
      </div>
    </div>
  )
}

export default ErrorBanner
