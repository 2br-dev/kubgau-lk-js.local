import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Button,
	Card,
	CardContent,
	MenuItem,
	Tabs,
	Tab,
	Checkbox,
	FormControl,
	FormControlLabel,
	Select,
	InputLabel,
} from "@mui/material";
import DekanTable from "./components/dekanTable";
import UMUTable from "./components/umuTable";

// TODO
// В режиме всех факультетов выводить только заголовки с возможностью раскрытия секции

function SessionManager() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [umuTab, setUmuTab] = useState(0);
	const [faculty, setFaculty] = useState("0");
	const [faculties, setFaculties] = useState([]);
	const loggedUserData = localStorage.getItem("loggedUser");
	const loggedUser = JSON.parse(loggedUserData);
	const [requestsOnly, setRequestsOnly] = useState(false);

	useEffect(() => {
		switch (loggedUser.role) {
			case "umu":
				fetch("/data/umu_sessions.json")
					.then((res) => res.json())
					.then((response) => {
						setData(groupUMUData(response.data));
						const filteredData = filterUMUData(
							null,
							null,
							groupUMUData(response.data),
						);
						setFilteredData(filteredData);
						let sessions = response.data;

						fetch("/data/faculties.json")
							.then((res) => res.json())
							.then((fresponse) => {
								const defaultFaculties = [
									{
										key: "0",
										value: "Все факультеты",
									},
								];
								const actual = getActual(
									sessions,
									fresponse.data,
								);
								setFaculties([...defaultFaculties, ...actual]);
							});
					});
				break;
			default:
				fetch("/data/sessions.json")
					.then((res) => res.json())
					.then((response) => {
						setData(groupData(response.data));
					});
				break;
		}
		// eslint-disable-next-line
	}, []);

	const setRequestsFilter = (e) => {
		setRequestsOnly(e.target.checked);
		filterUMUData(null, e.target.checked);
	};

	const getActual = (disciplines, faculties) => {
		let outputFaculties = [];
		for (let i = 0; i < disciplines.length; i++) {
			if (disciplines[i].sessions.length) {
				outputFaculties.push(faculties[i]);
			}
		}
		return outputFaculties;
	};

	const handleTabChange = (e, newVal) => {
		setUmuTab(newVal);
	};

	const suffix =
		loggedUser.role === "dekan" ? (
			<Button variant="contained" color="primary">
				Студенты-задолжники
			</Button>
		) : (
			<></>
		);

	const tableContent = () => {
		if (loggedUser.role === "dekan") {
			return <DekanTable data={data} />;
		} else {
			if (umuTab === 0) {
				return <UMUTable data={filteredData} />;
			}
		}
	};

	const groupUMUData = (data) => {
		const faculties = data.map((f) => {
			let groups = f.sessions.map((s) => {
				return s.programOfEducationName;
			});

			const groupsUnique = [...new Set(groups)];
			const disciplines = [];

			groupsUnique.forEach((group) => {
				disciplines.push({
					discipline: group,
					sessions: f.sessions.filter(
						(s) => s.programOfEducationName === group,
					),
				});
			});

			return {
				name: f.facultyName,
				id: f.facultyId,
				disciplines: disciplines,
			};
		});
		return faculties;
	};

	const groupData = (data) => {
		const groupsContent = data.map((d) => d.programOfEducationName);
		const groups = [...new Set(groupsContent)];

		const groupedData = groups.map((g) => {
			return {
				name: g,
				data: data.filter((i) => {
					return i.programOfEducationName === g;
				}),
			};
		});
		return groupedData;
	};

	const filterUMUData = (
		facultyId = null,
		requests = null,
		inputData = null,
	) => {
		const umuData = inputData !== null ? inputData : data;
		let _data = JSON.parse(JSON.stringify(umuData));
		facultyId = facultyId ?? faculty;
		requests = requests ?? requestsOnly;
		let filtered = _data.filter((item) => {
			if (requests === true) {
				item.disciplines.forEach((d) => {
					d.sessions = d.sessions.filter(
						(s) => s.approveStatus === 1,
					);
				});
			}
			if (parseInt(facultyId) !== 0) {
				return item.id === parseInt(facultyId);
			} else {
				return true;
			}
		});
		setFilteredData(filtered);
		return filtered;
	};

	const handleFacultyChange = (e) => {
		setFaculty(e.target.value);
		filterUMUData(e.target.value, null);
	};

	const filterControls = () => {
		if (umuTab === 0) {
			return (
				<div
					className="filters"
					style={{
						display: "flex",
						alignItems: "center",
						flexWrap: "wrap",
						marginBottom: "20px",
						maxWidth: "100%",
					}}
				>
					<FormControlLabel
						sx={{
							userSelect: "none",
							maxWidth: "100%",
							"& .MuiTypography-root": {
								maxWidth: "calc(100%)",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							},
						}}
						control={
							<Checkbox
								checked={requestsOnly}
								onChange={setRequestsFilter}
							/>
						}
						label="Только заявки на утверждение"
					/>
					<FormControl
						variant="standard"
						sx={{
							minWidth: "200px",
							transform: "translateY(-8px)",
						}}
					>
						<InputLabel>Выберите факультет</InputLabel>
						<Select
							value={faculty}
							onChange={handleFacultyChange}
							MenuProps={{
								style: {
									maxHeight: 400,
								},
								transformOrigin: {
									horizontal: "right",
									vertical: "top",
								},
								anchorOrigin: {
									horizontal: "right",
									vertical: "bottom",
								},
							}}
						>
							{faculties.map((f, index) => (
								<MenuItem key={index} value={f.key}>
									{f.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			);
		}

		return <></>;
	};

	const umuFilters = () => {
		if (loggedUser.role === "umu") {
			return (
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "flex-start",
						justifyContent: "space-between",
					}}
				>
					<div className="tabs">
						<Tabs
							value={umuTab}
							onChange={handleTabChange}
							variant="scrollable"
							sx={{ marginBottom: "20px" }}
						>
							<Tab value={0} label="Секции факультетов" />
							<Tab
								value={1}
								label="Заявки на внеплановые сессии"
							/>
						</Tabs>
					</div>
					{filterControls()}
				</div>
			);
		}
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
						<CardContent sx={{ minHeight: 450 }}>
							{umuFilters()}
							{tableContent()}
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default SessionManager;
