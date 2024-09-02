import React, { Fragment, useState } from "react";
import PageHeader from "../../components/pageHeader";
import { Button, Card, CardContent } from "@mui/material";
import DekanTable from "./components/dekanTable";
import UMUTable from "./components/umuTable";
import OutplanRequests from "./components/outplanRequests";
import UMUFilters from "./components/umuControls";

function SessionManager() {
	const [umuTab, setUmuTab] = useState(0);
	const [faculty, setFaculty] = useState(null);
	const loggedUserData = localStorage.getItem("loggedUser");
	const loggedUser = JSON.parse(loggedUserData);
	const [requestsOnly, setRequestsOnly] = useState(false);
	const [faculties, setFaculties] = useState([]);

	const handleRequestsChange = (reqOnly) => {
		setRequestsOnly(reqOnly);
	};

	const handleTabChange = (tabVal) => {
		setUmuTab(tabVal);
	};

	const handleFacultyChange = (faculty) => {
		setFaculty(faculty);
	};

	const suffix =
		loggedUser.role === "dekan" ? (
			<Button variant="contained" color="primary">
				Студенты-задолжники
			</Button>
		) : (
			<></>
		);

	const setupFaculties = (data) => {
		const faculties = data.map((item) => {
			return {
				key: item.id,
				value: item.name,
			};
		});
		const allFaculties = {
			key: null,
			value: "Все факультеты",
		};
		setFaculties([allFaculties, ...faculties]);
	};

	const tableContent = () => {
		if (loggedUser.role === "dekan") {
			return <DekanTable />;
		} else {
			switch (umuTab) {
				case 1:
					return <OutplanRequests />;
				default:
					return (
						<UMUTable
							onLoad={setupFaculties}
							requestsOnly={requestsOnly}
							faculty={faculty}
						/>
					);
			}
		}
	};

	const filters = () => {
		if (loggedUser.role === "umu") {
			return (
				<UMUFilters
					umuTab={umuTab}
					faculty={faculty}
					faculties={faculties}
					onTabChange={handleTabChange}
					onFacultyChange={handleFacultyChange}
					onRequestsChange={handleRequestsChange}
				/>
			);
		}
		return <></>;
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header="Управление сессиями"
						backLink={true}
						suffix={suffix}
					/>
					<Card>
						<CardContent sx={{ minHeight: "60vh" }}>
							{filters()}
							{tableContent()}
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default SessionManager;
