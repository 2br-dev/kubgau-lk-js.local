import { createTheme } from "@mui/material";

const toggleTheme = createTheme({
	components: {
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: "#2e2e2e",
					backgroundColor: "#ffffff",
					border: "1px solid #42A5F5 !important",
					fontSize: "16px",
					fontFamily: "Wix Madefor Text",
					"&.Mui-selected": {
						color: "#fff",
						backgroundColor: "#42A5F5",
					},
					"&.Mui-selected:hover": {
						color: "#fff",
						backgroundColor: "#0F87E7",
					},
					"&.MuiToggleButtonGroup-grouped": {
						lineHeight: "1em",
						fontSize: "16px",
						textTransform: "none",
						padding: "8px 16px",
					},
				},
			},
		},
	},
});

export default toggleTheme;
