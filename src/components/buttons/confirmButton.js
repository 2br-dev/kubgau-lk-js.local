import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const ConfirmButton = styled(Button)({
	boxShadow: "none",
	textTransform: "none",
	fontSize: 16,
	padding: "6px 12px",
	border: "1px solid",
	lineHeight: 1.5,
	backgroundColor: "#00BFA5",
	borderColor: "#00BFA5",
	fontFamily: ["Wix Madefor Display"].join(","),
	"&:hover": {
		backgroundColor: "#00A18B",
		borderColor: "#00A18B",
		boxShadow: "none",
	},
	"&:active": {
		boxShadow: "none",
		backgroundColor: "#00A18B",
		borderColor: "#00A18B",
	},
});

export default ConfirmButton;
