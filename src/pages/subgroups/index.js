import {
	FormControl,
	Switch,
	Button,
	Card,
	CardContent,
	Tabs,
	Tab,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Checkbox,
	FormLabel,
	ToggleButtonGroup,
	ToggleButton,
	Snackbar,
	IconButton,
	ThemeProvider,
} from "@mui/material";
import PageHeader from "../../components/pageHeader";
import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import ErrorBanner from "../../components/error_banner";
import "./index.scss";
import { PrintRounded, ClearRounded, SaveRounded } from "@mui/icons-material";
import { toggleTheme } from "../../components/toggleTheme/index";
import React from "react";

/**
 * Страница управления подгруппами
 */
function Subgroups() {
	const [groups, setGroups] = useState([]);
	const [group, setGroup] = useState([]);
	const [groupId, setGroupId] = useState(0);
	const [filteredGroup, setFilteredGroup] = useState([]);
	const [filterVal, setFilterVal] = useState("all");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [discipline, setDiscipline] = useState("");

	// Стилизованный переключатель
	const StyledSwitch = styled(Switch)(() => ({
		"& .MuiSwitch-switchBase": {
			"&.Mui-checked": {
				color: "#fff",
				"& + .MuiSwitch-track": {
					backgroundColor: "#00BFA5",
					opacity: 1,
				},
			},
		},
		"& .MuiSwitch-track": {
			backgroundColor: "#FF1744",
			opacity: 1,
			"&::before, &::after": {
				content: '""',
				position: "absolute",
				top: "50%",
				transform: "translateY(-50%)",
				width: 16,
				height: 16,
				backgroundSize: "contain",
			},
		},
		"& .MuiSwitch-thumb": {
			backgroundColor: "#D9D9D9",
		},
	}));

	// Получение начальных данных
	const loadJson = useCallback(() => {
		// Загрузка списка групп
		fetch("/data/subgroups.json")
			.then((response) => response.json())
			.then((response) => {
				setDiscipline(response.disciplineName);
				setGroups(response.subGroups);

				response.subGroups[groupId].freeStudents.forEach((s) => {
					s.isFree = true;
				});

				response.subGroups[groupId].students.forEach((s) => {
					s.isFree = false;
				});

				const g = response.subGroups[groupId];
				const joinedGroup = [...g.freeStudents, ...g.students];

				setGroup(joinedGroup);
				setFilteredGroup(joinedGroup);
			});
	}, [groupId]);

	useEffect(() => {
		loadJson();
	}, [loadJson]);

	// Фильтр групп
	const filter = useCallback(
		(students) => {
			switch (filterVal) {
				case "unattached":
					return students.filter(
						(s) =>
							s.isFree === true && s.isCurrentEmployee === false,
					);
				case "own":
					return students.filter((s) => s.isFree === true);
				default:
					return students;
			}
		},
		[filterVal],
	);

	// Callback для простановки фильтров
	useEffect(() => {
		setFilteredGroup(filter(group));
	}, [filterVal, group, filter]);

	// Печать групп
	const printGroups = () => {
		window.print();
	};

	// Переключение вкладки
	const switchGroup = (e, newVal) => {
		setGroupId(newVal);
		let groupName = e.target.textContent;
		let newGroup = groups.filter((g) => {
			return g.groupFlowTeamName === groupName;
		})[0];

		newGroup.freeStudents.forEach((s) => (s.isFree = true));
		newGroup.students.forEach((s) => (s.isFree = false));

		let outputGroup = [...newGroup.freeStudents, ...newGroup.students];
		setGroup(outputGroup);
		setFilteredGroup(outputGroup);
	};

	// Сброс
	const reset = () => {
		loadJson();
	};

	// Колонка с распределением/преподавателем
	const groupVal = (student) => {
		if (!student.isFree) {
			return student.attachedEmployee;
		} else {
			let checked = student.isCurrentEmployee === true;
			return <StyledSwitch checked={checked}></StyledSwitch>;
		}
	};

	// Переключение распределения
	const toggleAttach = (e) => {
		let newGroup = [...filteredGroup];
		let studentId = parseInt(e.currentTarget.dataset["id"]);
		let student = newGroup[studentId];

		if (student.isFree) {
			student.isCurrentEmployee = !student.isCurrentEmployee;
		}
		setFilteredGroup(filter(newGroup));

		// Проверяем нераспределённые
		let unAttached = group.filter((s) => {
			return s.isFree === true && s.isCurrentEmployee === false;
		});

		if (unAttached.length === 0) {
			setFilterVal("all");
		}
	};

	// Отобразить нераспределённых
	const toggleNonAttached = (e, newVal) => {
		setFilterVal(newVal ? "unattached" : "all");
	};

	// Контрол в банере с ошибкой
	const filterControl = (
		<FormControl className="non-attach-wrapper">
			<FormLabel
				sx={{
					userSelect: "none",
					color: "#333",
					cursor: "pointer",
					"&.Mui-focused": { color: "red" },
				}}
				htmlFor="non-attached"
			>
				Нераспределённые
			</FormLabel>
			<Checkbox
				inputProps={{ "aria-label": "controlled" }}
				value="unattached"
				sx={{ "&.Mui-checked": { color: "red" } }}
				checked={filterVal === "unattached"}
				onChange={toggleNonAttached}
				id="non-attached"
			/>
		</FormControl>
	);

	const warning = () => {
		const haveUnattached =
			group.filter((s) => s.isFree && s.isCurrentEmployee === false)
				.length > 0;
		if (haveUnattached) {
			return (
				<ErrorBanner
					message="У группы есть нераспределённые студенты!"
					control={filterControl}
				/>
			);
		} else {
			return null;
		}
	};

	// Подзаголовок для печати
	const printSubheader = () => {
		if (groups[groupId]) {
			return (
				<h2 className="print" style={{ marginTop: 0 }}>
					{groups[groupId].name}
				</h2>
			);
		}
		return <></>;
	};

	// Набор фильтров
	const filtersControl = (
		<ThemeProvider theme={toggleTheme}>
			<ToggleButtonGroup className="filters desktop screen">
				<ToggleButton
					size="small"
					value="all"
					selected={filterVal === "all"}
					onClick={() => setFilterVal("all")}
				>
					Все
				</ToggleButton>
				<ToggleButton
					size="small"
					value="unattached"
					selected={filterVal === "unattached"}
					onClick={() => {
						setFilterVal("unattached");
					}}
				>
					Нераспределённые
				</ToggleButton>
				<ToggleButton
					size="small"
					value="own"
					selected={filterVal === "own"}
					onClick={() => {
						setFilterVal("own");
					}}
				>
					Только свои
				</ToggleButton>
			</ToggleButtonGroup>
			<ToggleButtonGroup
				orientation="vertical"
				sx={{ width: "100%" }}
				className="filters screen mobile"
			>
				<ToggleButton
					size="small"
					value="all"
					selected={filterVal === "all"}
					onClick={() => setFilterVal("all")}
				>
					Все
				</ToggleButton>
				<ToggleButton
					size="small"
					value="unattached"
					selected={filterVal === "unattached"}
					onClick={() => {
						setFilterVal("unattached");
					}}
				>
					Нераспределённые
				</ToggleButton>
				<ToggleButton
					size="small"
					value="own"
					selected={filterVal === "own"}
					onClick={() => {
						setFilterVal("own");
					}}
				>
					Только свои
				</ToggleButton>
			</ToggleButtonGroup>
		</ThemeProvider>
	);

	// Сохранение
	const save = () => {
		setSnackbarMessage("Готово!");
		setSnackbarOpen(true);

		setTimeout(() => {
			setSnackbarOpen(false);
		}, 2000);
	};

	// Простановка распределения у всех своих студентов
	const mark = () => {
		let newGroup = [...group];

		newGroup.forEach((student) => {
			if (student.isFree) {
				student.isCurrentEmployee = true;
			}
		});

		setGroup(newGroup);
	};

	// Снятие распределения у всех своих студентов
	const unmark = () => {
		let newGroup = [...group];

		newGroup.forEach((student) => {
			if (student.isFree) {
				student.isCurrentEmployee = false;
			}
		});

		setGroup(newGroup);
	};

	const tableContent = () => {
		return (
			<TableContainer>
				<Table className="simple-table">
					<TableHead>
						<TableRow>
							<TableCell>ФИО</TableCell>
							<TableCell className="print">Распределён</TableCell>
							<TableCell className="print">
								Преподаватель
							</TableCell>
							<TableCell
								className="screen"
								sx={{
									textAlign: "right",
								}}
							>
								Группа/Распределение
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredGroup.map((student, index) => (
							<TableRow
								sx={{
									userSelect: "none",
								}}
								data-id={index}
								onClick={toggleAttach}
								key={index}
								hover
							>
								<TableCell>
									{student.lastName} {student.firstName}{" "}
									{student.middleName}
								</TableCell>
								<TableCell className="print">
									{student.state ? "Да" : "Нет"}
								</TableCell>
								<TableCell className="print">
									{student.attachedEmployee}
								</TableCell>
								<TableCell
									className="screen"
									sx={{
										textAlign: "right",
									}}
								>
									{groupVal(student)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	// DOM
	return (
		<>
			<main id="subgroups">
				<section>
					<div className="container">
						<PageHeader
							header={discipline}
							backLink={true}
							subheader="Управление подгруппами"
							suffix={filtersControl}
						/>
						<Card>
							<CardContent>
								{warning()}
								<div className="subgroup-header">
									<Tabs
										variant="scrollable"
										className="screen"
										value={groupId}
										onChange={switchGroup}
									>
										{groups.map((g, index) => (
											<Tab
												data-group={g.groupFlowTeamName}
												value={index}
												key={index}
												label={g.groupFlowTeamName}
											/>
										))}
									</Tabs>
									{printSubheader()}
									<div className="screen controls">
										<Button
											onClick={unmark}
											variant="outlined"
										>
											Снять отметку
										</Button>
										<Button
											onClick={mark}
											variant="outlined"
										>
											Отметить все
										</Button>
									</div>
								</div>
								<div className="subgroup-content">
									{tableContent()}
								</div>
							</CardContent>
						</Card>
						<div className="card-actions-wrapper screen desktop">
							<div className="left-side">
								<Button
									onClick={printGroups}
									variant="outlined"
								>
									Печать
								</Button>
							</div>
							<div className="right-side">
								<Button variant="outlined" onClick={reset}>
									Сброс
								</Button>
								<Button variant="contained" onClick={save}>
									Сохранить
								</Button>
							</div>
						</div>
						<div className="card-actions-wrapper mobile desktop">
							<IconButton onClick={printGroups}>
								<PrintRounded />
							</IconButton>
							<IconButton onClick={reset}>
								<ClearRounded />
							</IconButton>
							<IconButton onClick={save}>
								<SaveRounded />
							</IconButton>
						</div>
					</div>
				</section>
			</main>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={snackbarOpen}
				message={snackbarMessage}
			/>
		</>
	);
}

export default Subgroups;
