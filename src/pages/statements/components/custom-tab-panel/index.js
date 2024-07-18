import { Box } from "@mui/material"

export default function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      className="card-panel"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab=${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, paddingLeft: 0, paddingRight: 0 }}>{children}</Box>
      )}
    </div>
  )
}
