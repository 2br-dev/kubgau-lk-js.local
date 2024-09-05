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
import SessionManager from "./pages/sessions";
import SessionEditor from "./pages/createSession";
import SessionTiming from "./pages/sessionTiming";
import UMUDashboard from "./pages/umu_dashboard";
import SessionApprove from "./pages/sessionApprove";
import OutplanRepasses from "./pages/outplan_requests";
import DekanStatements from "./pages/dekan_statements";
import SuspendSession from "./pages/suspendSession";
import CreateStatement from "./pages/createStatement";
import SessionSuspendRequests from "./pages/sessionSuspendRequests";
import SessionSuspendRequest from "./pages/sessionSuspendRequest";

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
								<Route
									path="sessions"
									element={<SessionManager />}
								/>
								<Route
									path="create-session/:course"
									element={<SessionEditor />}
								/>
								<Route
									path="session-timing"
									element={<SessionTiming />}
								/>
								<Route
									path="umu-dashboard"
									element={<UMUDashboard />}
								/>
								<Route
									path="outplan-repasses"
									element={<OutplanRepasses />}
								/>
								<Route
									path="session-approve/:sessionId"
									element={<SessionApprove />}
								/>
								<Route
									path="dekan-statements/"
									element={<DekanStatements />}
								/>
								<Route
									path="suspend-session/"
									element={<SuspendSession />}
								/>
								<Route
									path="create-statement/"
									element={<CreateStatement />}
								/>
								<Route
									path="session-suspend-requests"
									element={<SessionSuspendRequests />}
								/>
								<Route
									path="session-suspend-requests/:requestId"
									element={<SessionSuspendRequest />}
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
