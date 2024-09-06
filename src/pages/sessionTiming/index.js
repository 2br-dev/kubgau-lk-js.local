import React, { Fragment, useCallback } from "react";
import PageHeader from "../../components/pageHeader";
import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	Tabs,
	Tab,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Tooltip,
} from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import GroupModal from "./components/groupModal";

function SessionTiming() {
	const [disciplines, setDisciplines] = useState([]);
	const [filteredDisciplines, setFilteredDisciplines] = useState([]);
	const [header, setHeader] = useState("");
	const [tabValue, setTabValue] = useState(0);
	const [open, setOpen] = useState(false);
	const [disciplineIndex, setDisciplineIndex] = useState(0);
	const [groupIndex, setGroupIndex] = useState(0);
	const [disciplineName, setDisciplineName] = useState("");
	const [chairName, setChairName] = useState("");
	const [group2edit, setGroup2edit] = useState({
		groupId: null,
		groupName: "",
		eventDate: null,
		eventTime: null,
		eventPlace: "",
		employees: [],
		extraEmployees: [],
	});
	const [availableTeachers, setAvailableTeachers] = useState([]);

	const filterDisciplines = useCallback(
		(d = null, tab = null) => {
			if (d === null) d = disciplines;
			if (tab === null) tab = tabValue;

			return d.filter((d) => d.controlType === tab);
		},
		[tabValue, disciplines],
	);

	useEffect(() => {
		fetch("/data/sessionTiming.json")
			.then((res) => res.json())
			.then((response) => {
				setDisciplines(response.schedule.disciplines);
				setFilteredDisciplines(
					filterDisciplines(response.schedule.disciplines),
				);
				setHeader(response.schedule.courseName);
				setAvailableTeachers(response.chairEmployees);
			});
	}, []);

	const handleTabChange = (e, newVal) => {
		setTabValue(newVal);
		setFilteredDisciplines(filterDisciplines(null, newVal));
	};

	const formatDate = (date) => {
		if (date !== null) {
			return new Date(date).toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}
		return date;
	};

	const formatEmployees = (employeesArray) => {
		if (employeesArray.length) {
			const shortArr = employeesArray.map((e) => {
				return `${e.lastName} ${e.firstName.substr(0, 1)}. ${e.middleName.substr(0, 1)}.`;
			});
			return shortArr.join(", ");
		}
		return "—";
	};

	const handleOpen = (e) => {
		const disciplineIndex = parseInt(e.currentTarget.dataset.discipline);
		const groupIndex = parseInt(e.currentTarget.dataset.group);
		const discipline = filteredDisciplines[disciplineIndex];
		const group = discipline.groups[groupIndex];
		setDisciplineIndex(disciplineIndex);
		setGroupIndex(groupIndex);
		setGroup2edit(group);
		setDisciplineName(discipline.disciplineName);
		setChairName(discipline.chairName);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSave = (group, disciplineIndex, groupIndex) => {
		disciplines[disciplineIndex].groups[groupIndex] = group;
		setDisciplines([...disciplines]);
		setOpen(false);
	};

	const groupContent = (discipline, disciplineIndex) => {
		return discipline.groups.map((g, groupIndex) => {
			return (
				<TableRow key={groupIndex} hover>
					<TableCell>{groupIndex + 1}</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{g.groupName}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatDate(g.eventDate)} {g.eventTime}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{g.eventPlace}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatEmployees(g.employees)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{g.extraEmployees.join(",") || "—"}
					</TableCell>
					<TableCell sx={{ textAlign: "right" }}>
						<Tooltip placement="top" title="Редактировать группу">
							<IconButton
								data-discipline={disciplineIndex}
								data-group={groupIndex}
								onClick={handleOpen}
							>
								<EditRounded />
							</IconButton>
						</Tooltip>
					</TableCell>
				</TableRow>
			);
		});
	};

	const tableContent = () => {
		return (
			<TableContainer>
				<Table className="simple-table">
					<TableHead>
						<TableRow>
							<TableCell>№</TableCell>
							<TableCell>Группа</TableCell>
							<TableCell>Дата/время</TableCell>
							<TableCell>Место</TableCell>
							<TableCell>Преподаватели</TableCell>
							<TableCell>Дополнительные преподаватели</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredDisciplines.map((d, index) => (
							<Fragment key={index}>
								<TableRow>
									<TableCell
										colSpan={7}
										sx={{
											paddingTop: "40px",
											paddingBottom: "6px",
										}}
									>
										<div
											style={{
												fontSize:
													"clamp(18px, 3vw, 21px)",
											}}
										>
											<strong>{d.disciplineName}</strong>{" "}
											({d.chairName})
										</div>
									</TableCell>
								</TableRow>
								{groupContent(d, index)}
							</Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header={header}
						subheader="Расписание сессии"
						backLink={true}
					/>
					<Card>
						<CardContent>
							<Tabs
								variant="scrollable"
								value={tabValue}
								onChange={handleTabChange}
								sx={{ marginBottom: "20px" }}
							>
								<Tab value={0} label="Экзамен" />
								<Tab value={1} label="Зачёт" />
								<Tab value={3} label="Курсовая работа" />
							</Tabs>
							{tableContent()}
						</CardContent>
					</Card>
				</div>
			</section>
			<GroupModal
				isOpen={open}
				group={group2edit}
				groupIndex={groupIndex}
				disciplineIndex={disciplineIndex}
				onClose={handleClose}
				onSubmit={handleSave}
				disciplineName={disciplineName}
				chairName={chairName}
				control={tabValue}
				availableTeachers={availableTeachers}
			/>
		</main>
	);
}

export default SessionTiming;
