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

const successTheme = createTheme({
	components: {
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: "#007767",
					backgroundColor: "#ffffff",
					border: "1px solid #42A5F5 !important",
					fontSize: "16px",
					fontFamily: "Wix Madefor Text",
					"&.Mui-selected": {
						color: "#fff",
						backgroundColor: "#00BFA5",
					},
					"&.Mui-selected:hover": {
						color: "#fff",
						backgroundColor: "#009581",
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

const blackMarkTheme = createTheme({
	components: {
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: "#007767",
					backgroundColor: "#ffffff",
					border: "1px solid #42A5F5 !important",
					fontSize: "16px",
					fontFamily: "Wix Madefor Text",
					"&.Mui-selected": {
						color: "#fff",
						backgroundColor: "#2E2E2E",
					},
					"&.Mui-selected:hover": {
						color: "#fff",
						backgroundColor: "#000000",
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

const warningTheme = createTheme({
	components: {
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: "#E4700A",
					backgroundColor: "#ffffff",
					border: "1px solid #42A5F5 !important",
					fontSize: "16px",
					fontFamily: "Wix Madefor Text",
					"&.Mui-selected": {
						color: "#fff",
						backgroundColor: "#F38E1B",
					},
					"&.Mui-selected:hover": {
						color: "#fff",
						backgroundColor: "#D07207",
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

const criticalTheme = createTheme({
	components: {
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: "#B21010",
					backgroundColor: "#ffffff",
					border: "1px solid #42A5F5 !important",
					fontSize: "16px",
					fontFamily: "Wix Madefor Text",
					"&.Mui-selected": {
						color: "#fff",
						backgroundColor: "#E82222",
					},
					"&.Mui-selected:hover": {
						color: "#fff",
						backgroundColor: "#D41313",
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

export {
	toggleTheme,
	successTheme,
	warningTheme,
	criticalTheme,
	blackMarkTheme,
};
