import MainPage from "./pages/main/";
import "./scss/master.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/login/";
import CoursePage from "./pages/course";
import StatementsPage from "./pages/statements";
import { createTheme, ThemeProvider } from "@mui/material";
import GroupsPage from "./pages/groups";
import Journal from "./pages/journal";
import Subgroups from "./pages/subgroups";
import Statement from "./pages/statement";
import React from "react";
import { DialogsProvider } from "@toolpad/core";
import PracticeStatements from "./pages/practiceStatements";
import PracticeDetails from "./pages/practiceDetails";
import GroupCurators from "./pages/groupCurators";

function App() {
	// Установка шрифта для приложения
	const theme = createTheme({
		typography: {
			fontFamily: "Wix Madefor Text",
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<DialogsProvider>
				<div className="App">
					{/* Роутер */}
					<Router>
						<Routes>
							<Route path="/" element={<LoginScreen />} />
							<Route path="/main" element={<MainPage />}>
								<Route
									path="courses"
									element={<CoursePage />}
								/>
								<Route
									path="statements/:type"
									element={<StatementsPage />}
								/>
								<Route
									path="practice-statements"
									element={<PracticeStatements />}
								/>
								<Route path="groups" element={<GroupsPage />} />
								<Route path="journal" element={<Journal />} />
								<Route
									path="subgroups"
									element={<Subgroups />}
								/>
								<Route
									path="statement/:type"
									element={<Statement />}
								/>
								<Route
									path="practice-statement"
									element={<PracticeDetails />}
								/>
								<Route
									path="group-curators"
									element={<GroupCurators />}
								/>
							</Route>
						</Routes>
					</Router>
				</div>
			</DialogsProvider>
		</ThemeProvider>
	);
}

export default App;
