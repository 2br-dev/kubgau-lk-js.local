import { ErrorRounded, InfoRounded, WarningRounded } from "@mui/icons-material"
import "./styles.scss"

export let EType

;(function(EType) {
  EType["INFO"] = "info"
  EType["WARNING"] = "warning"
  EType["ERROR"] = "error"
})(EType || (EType = {}))

function NavbarInfo(props) {
  let icon

  switch (props.type) {
    case "error":
      icon = <ErrorRounded />
      break
    case "warning":
      icon = <WarningRounded />
      break
    default:
      icon = <InfoRounded />
      break
  }

  return (
    <div className={"navbar-info " + props.type}>
      <div className="container icon-block">
        {icon} {props.message}
      </div>
    </div>
  )
}

export default NavbarInfo
