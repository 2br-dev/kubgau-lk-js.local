import React, { Fragment } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	Divider,
	Menu,
	MenuItem,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	Link,
	Button,
	Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { LockOpenRounded, LockRounded } from "@mui/icons-material";

function DekanStatements() {
	const [course, setCourse] = useState({
		courseName: "Имя курса",
		disciplines: [],
	});
	const [filteredCourse, setFilteredCourse] = useState({
		courseName: "Имя курса",
		disciplines: [],
	});
	const [tabVal, setTabVal] = useState(0);

	const nullText = (
		<span style={{ color: "#aaa" }}>Необходимо закрыть предыдущую</span>
	);

	const [emptyAnchor, setEmptyAnchor] = useState(null);
	const [nonEmptyAnchor, setNonEmptyAnchor] = useState(null);
	const emptyOpen = Boolean(emptyAnchor);
	const nonEmptyOpen = Boolean(nonEmptyAnchor);
	const isAdmin = false;

	const openEmpty = (e) => {
		setEmptyAnchor(e.currentTarget);
	};

	const closeEmpty = () => {
		setEmptyAnchor(null);
	};

	const openNonEmpty = (e) => {
		setNonEmptyAnchor(e.currentTarget);
	};

	const closeNonEmpty = () => {
		setNonEmptyAnchor(null);
	};

	useEffect(() => {
		fetch("/data/getSessionStatements.json")
			.then((res) => res.json())
			.then((response) => {
				const serverCourse = {
					courseName: response.courseName,
					disciplines: response.disciplines.map((d) => {
						return {
							controlType: d.controlType,
							disciplineName: d.disciplineName,
							chairName: d.chairName,
							groups: groupByName(d.groups),
						};
					}),
				};
				setCourse(serverCourse);
				let filtered = filterCourse(serverCourse, 0);
				setFilteredCourse(filtered);
			});
	}, []);

	const groupByName = (groups) => {
		const names = groups.map((g) => g.groupName);
		const namesUnique = [...new Set(names)];

		const output = [];
		namesUnique.forEach((n) => {
			output.push({
				groupName: n,
				groups: groups.filter((g) => g.groupName === n),
			});
		});
		return output;
	};

	const handleTabChange = (e, newVal) => {
		setTabVal(newVal);
		setFilteredCourse(filterCourse(null, newVal));
	};

	const filterCourse = (data, tabNum) => {
		let course2filter = data ?? course;
		let tab2filter = tabNum ?? tabVal;
		let _course = { ...course2filter };

		switch (tab2filter) {
			case 12:
				_course.disciplines = _course.disciplines.filter(
					(d) => d.controlType === 1 || d.controlType === 2,
				);
				break;
			case 34:
				_course.disciplines = _course.disciplines.filter(
					(d) => d.controlType === 3 || d.controlType === 4,
				);
				break;
			default:
				_course.disciplines = _course.disciplines.filter((d) => {
					return d.controlType === tab2filter;
				});
		}

		return _course;
	};

	const statementVal = (group) => {
		if (group) {
			let state;
			if (group.dateOfClose === "" || group.dateOfClose === null) {
				state = (
					<LockOpenRounded
						sx={{ fontSize: 18, marginRight: "6px" }}
					/>
				);
			} else {
				state = (
					<LockRounded sx={{ fontSize: 18, marginRight: "6px" }} />
				);
			}

			let stateText =
				group.dateOfClose === "" || group.dateOfClose === null
					? "Ведомость открыта"
					: "Ведомость закрыта";

			if (group.statementId === 0 && !group.canCreate) {
				return nullText;
			}

			if (group.statementId > 0) {
				return (
					<Tooltip placement="top" title={stateText}>
						<Link
							onClick={openNonEmpty}
							style={{
								display: "inline-flex",
								alignItems: "center",
								cursor: "pointer",
								textDecoration: "none",
							}}
						>
							{state}
							Ведомость №{group.statementNumber}
						</Link>
					</Tooltip>
				);
			} else {
				if (isAdmin) {
					return (
						<Link
							onClick={openEmpty}
							sx={{ cursor: "pointer", textDecoration: "none" }}
						>
							Ведомость не создана
						</Link>
					);
				} else {
					return <Button variant="text">Создать ведомость</Button>;
				}
			}
		} else {
			return nullText;
		}
	};

	const table = () => {
		return filteredCourse.disciplines.map((d, dindex) => {
			return (
				<Fragment key={dindex}>
					<TableRow key={dindex}>
						<TableCell colSpan={5}>
							<h3 style={{ marginBottom: 0 }}>
								{d.disciplineName}
							</h3>
						</TableCell>
					</TableRow>
					{d.groups.map((g, gindex) => {
						return (
							<TableRow key={gindex} hover>
								<TableCell>{g.groupName}</TableCell>
								<TableCell>
									{statementVal(g.groups[0])}
								</TableCell>
								<TableCell>
									{statementVal(g.groups[1])}
								</TableCell>
								<TableCell>
									{statementVal(g.groups[2])}
								</TableCell>
							</TableRow>
						);
					})}
				</Fragment>
			);
		});
	};

	const adminMenu = () => {
		if (isAdmin) {
			return (
				<>
					<Divider />
					<MenuItem>Редактировать сдачу</MenuItem>
					<MenuItem>Редактировать ведомость</MenuItem>
				</>
			);
		}
	};

	const openStatementMenu = () => (
		<Menu
			open={nonEmptyOpen}
			anchorEl={nonEmptyAnchor}
			onClose={closeNonEmpty}
		>
			<MenuItem>Подробности и результаты</MenuItem>
			<MenuItem>Изменить ведомость</MenuItem>
			<MenuItem>Справочная ведомость</MenuItem>
			<MenuItem>Отчёт</MenuItem>
			{adminMenu()}
		</Menu>
	);

	const emptyStatementMenu = () => (
		<Menu open={emptyOpen} anchorEl={emptyAnchor} onClose={closeEmpty}>
			<MenuItem>Сформировать ведомость</MenuItem>
			<Divider />
			<MenuItem>Редактировать сдачу</MenuItem>
		</Menu>
	);

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header={course.courseName}
						backLink={true}
						subheader="Управление ведомостями"
					/>
					<Card>
						<CardContent>
							<Tabs
								value={tabVal}
								onChange={handleTabChange}
								variant="scrollable"
							>
								<Tab value={0} label="Экзамены" />
								<Tab value={12} label="Зачёты" />
								<Tab value={34} label="Курсовые работы" />
							</Tabs>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell sx={{ width: "25%" }}>
												Группа
											</TableCell>
											<TableCell sx={{ width: "25%" }}>
												Основная
											</TableCell>
											<TableCell sx={{ width: "25%" }}>
												Внеплановая
											</TableCell>
											<TableCell sx={{ width: "25%" }}>
												Комисионная
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{table()}</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</div>
			</section>
			{openStatementMenu()}
			{emptyStatementMenu()}
		</main>
	);
}

export default DekanStatements;
