import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table,
	TableBody,
	Tabs,
	Tab,
	TextField,
	ButtonGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import formatRange from "../../components/formatDate";
import { Grid } from "@mui/material";
import ConfirmButton from "../../components/buttons/confirmButton";
import RejectButton from "../../components/buttons/rejectButton";

function SessionApprove() {
	const [course, setCourse] = useState({
		name: "Название курса",
		checks: "– : –",
		exams: "– : –",
		holidays: "– : –",
		disciplines: [],
	});

	const [controlType, setControlType] = useState(0);
	const [repass, setRepass] = useState(false);

	useEffect(() => {
		fetch("/data/sessionDataForApprove.json")
			.then((res) => res.json())
			.then((response) => {
				setCourse({
					name: response.courseName,
					checks: formatRange(
						response.checksStartDate,
						response.checksEndDate,
					),
					exams: formatRange(
						response.examsStartDate,
						response.examsEndDate,
					),
					holidays: formatRange(
						response.holidaysStartDate,
						response.holidaysEndDate,
					),
					disciplines: response.disciplines,
				});
			});
	}, []);

	const formatEmployees = (employees) => {
		if (employees.length > 0) {
			let employeeArray = employees.map((e) => {
				let arr = e.split(" ");
				return (
					arr[0] +
					" " +
					arr[1].charAt(0) +
					". " +
					arr[2].charAt(0) +
					"."
				);
			});
			return employeeArray.join(", ");
		}
		return "–";
	};

	const getDate = (date, returnData) => {
		if (date !== "") {
			let reformDate = date.split(" ")[0];
			let correctDate =
				reformDate[1] + "/" + reformDate[0] + "/" + reformDate[2];
			let d = new Date(correctDate);
			if (returnData === "date") {
				return d.toLocaleDateString("ru", {
					day: "numeric",
					month: "long",
					year: "numeric",
				});
			} else {
				return date.split(" ")[1];
			}
		}

		return "–";
	};

	const groupCells = (groups) => {
		return groups.map((g, gindex) => {
			return (
				<TableRow key={gindex}>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{g.groupName}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{getDate(g.eventDate, "date")}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{getDate(g.eventDate, "time")}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{g.eventPlace}
					</TableCell>
				</TableRow>
			);
		});
	};

	const tableBody = () => {
		let _disciplines = JSON.parse(
			JSON.stringify(course.disciplines),
		).filter((d) => d.controlType === controlType);

		let disciplines = [];
		_disciplines.forEach((d) => {
			if (repass) {
				d.groups = d.groups.filter((g) => g.passingType !== 1);
			} else {
				d.groups = d.groups.filter((g) => g.passingType === 1);
			}
			if (d.groups.length) disciplines.push(d);
		});

		if (disciplines.length) {
			return (
				<TableBody>
					{disciplines.map((d, dindex) => {
						let groups = d.groups;

						if (repass) {
							groups = d.groups.filter(
								(g) => g.passingType !== 1,
							);
						} else {
							groups = d.groups.filter(
								(g) => g.passingType === 1,
							);
						}

						return (
							<Fragment key={dindex}>
								<TableRow>
									<TableCell colSpan={4}>
										<h3 style={{ marginBottom: 0 }}>
											{d.disciplineName}
										</h3>
										<p style={{ margin: 0, color: "#aaa" }}>
											Основные преподаватели:{" "}
											{formatEmployees(d.employees)}
										</p>
										<p style={{ margin: 0, color: "#aaa" }}>
											Дополнительные преподаватели:{" "}
											{formatEmployees(d.extraEmployees)}
										</p>
									</TableCell>
								</TableRow>
								{groupCells(groups)}
							</Fragment>
						);
					})}
				</TableBody>
			);
		} else {
			return (
				<TableBody>
					<TableRow>
						<TableCell
							sx={{ textAlign: "center", padding: "2vmax 0" }}
							colSpan={6}
						>
							Нет данных
						</TableCell>
					</TableRow>
				</TableBody>
			);
		}
	};

	const handleTabChange = (e, newVal) => {
		setControlType(newVal);
	};

	const handleRepass = () => {
		setRepass(!repass);
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header={course.name}
						backLink={true}
						subheader="Утверждение сессии"
					/>
					<Grid container sx={{ margin: "2vmax 0" }}>
						<Grid item xl={3} lg={4} md={6} sm={12}>
							<span>Зачётная неделя: </span>
							<strong>{course.checks}</strong>
						</Grid>
						<Grid item xl={3} lg={4} md={6} sm={12}>
							<span>Экзамены: </span>
							<strong>{course.exams}</strong>
						</Grid>
						<Grid item xl={3} lg={4} md={6} sm={12}>
							<span>Каникулы: </span>
							<strong>{course.holidays}</strong>
						</Grid>
					</Grid>
					<Card>
						<CardContent>
							<div
								className="controls"
								style={{
									display: "flex",
									flexWrap: "wrap",
									justifyContent: "space-between",
								}}
							>
								<Tabs
									variant="scrollable"
									value={controlType}
									onChange={handleTabChange}
								>
									<Tab value={0} label="Экзамены" />
									<Tab value={1} label="Зачёты" />
									<Tab value={3} label="Курсовые работы" />
								</Tabs>
								<FormControlLabel
									label="Пересдачи"
									control={
										<Checkbox
											onChange={handleRepass}
											checked={repass}
										/>
									}
								/>
							</div>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell
												sx={{
													width: "25%",
												}}
											>
												Группа
											</TableCell>
											<TableCell
												sx={{
													width: "25%",
												}}
											>
												Дата
											</TableCell>
											<TableCell
												sx={{
													width: "25%",
												}}
											>
												Время
											</TableCell>
											<TableCell
												sx={{
													width: "25%",
												}}
											>
												Место
											</TableCell>
										</TableRow>
									</TableHead>
									{tableBody()}
								</Table>
							</TableContainer>
							<h3>Замечания</h3>
							<TextField
								label="Комментарии"
								fullWidth
								variant="standard"
							/>
							<div
								style={{
									textAlign: "right",
									marginTop: "1vmax",
								}}
							>
								<ButtonGroup
									variant="contained"
									disableElevation
								>
									<RejectButton>Отклонить</RejectButton>
									<ConfirmButton>Утвердить</ConfirmButton>
								</ButtonGroup>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default SessionApprove;
