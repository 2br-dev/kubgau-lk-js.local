import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const RejectButton = styled(Button)({
	boxShadow: "none",
	textTransform: "none",
	fontSize: 16,
	padding: "6px 12px",
	border: "1px solid",
	lineHeight: 1.5,
	backgroundColor: "#FF1744",
	borderColor: "#FF1744 !important",
	fontFamily: ["Wix Madefor Display"].join(","),
	"&:hover": {
		backgroundColor: "#C51133",
		borderColor: "#C51133",
		boxShadow: "none",
	},
	"&:active": {
		boxShadow: "none",
		backgroundColor: "#C51133",
		borderColor: "#C51133",
	},
});

export default RejectButton;
