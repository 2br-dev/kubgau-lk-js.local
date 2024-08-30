import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import formatRange from "../../components/formatDate";
import { Link, useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	CardContent,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Menu,
	MenuItem,
	Divider,
	Tooltip,
	Tabs,
	Tab,
	Checkbox,
	FormControl,
	FormControlLabel,
	Select,
	InputLabel,
} from "@mui/material";
import {
	CachedRounded,
	CheckRounded,
	CircleRounded,
	MoreVertRounded,
} from "@mui/icons-material";

function SessionManager() {
	const [data, setData] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [umuTab, setUmuTab] = useState(0);
	const [item, setItem] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const [faculty, setFaculty] = useState("0");
	const [faculties, setFaculties] = useState([
		{
			key: "0",
			value: "Все факультеты",
		},
	]);
	const loggedUserData = localStorage.getItem("loggedUser");
	const loggedUser = JSON.parse(loggedUserData);

	const handleCreate = (e) => {
		let courseId = parseInt(e.target.dataset.course);
		navigate(`/main/create-session/${courseId}`);
	};

	const handleTabChange = (e, newVal) => {
		setUmuTab(newVal);
	};

	useEffect(() => {
		switch (loggedUser.role) {
			case "umu":
				fetch("/data/faculties.json")
					.then((res) => res.json())
					.then((response) => {
						setFaculties([...faculties, ...response.data]);
					});
				fetch("/data/umu_sessions.json")
					.then((res) => res.json())
					.then((response) => {
						setData(groupUMUData(response.data));
					});
				break;
			default:
				fetch("/data/sessions.json")
					.then((res) => res.json())
					.then((response) => setData(groupData(response.data)));
				break;
		}
		// eslint-disable-next-line
	}, []);

	const handleClose = () => {
		setAnchorEl(null);
		setItem(null);
	};

	const handleClick = (e) => {
		const groupId = parseInt(e.currentTarget.dataset.group);
		const itemId = parseInt(e.currentTarget.dataset.item);
		setItem(data[groupId].data[itemId]);
		setAnchorEl(e.currentTarget);
	};

	const suffix =
		loggedUser.role === "dekan" ? (
			<Button variant="contained" color="primary">
				Студенты-задолжники
			</Button>
		) : (
			<></>
		);

	const warningMessage = () => {
		return (
			<ul style={{ paddingLeft: "0", margin: 0, listStyle: "none" }}>
				<li>
					<CheckRounded sx={{ height: ".5em" }} />
					Основная информация заполнена
				</li>
				<li>
					<CheckRounded sx={{ height: ".5em" }} />
					Расписание заполнено
				</li>
				<li>
					<CachedRounded sx={{ height: ".5em" }} />
					Ожидает утверждения
				</li>
			</ul>
		);
	};

	const indicator = (item) => {
		switch (true) {
			case item.approveStatus === 60:
				return (
					<Tooltip placement="top-start" title={warningMessage()}>
						<CircleRounded sx={{ color: "#FDD835" }} />
					</Tooltip>
				);
			case item.approveStatus === 100:
				return (
					<Tooltip placement="top-start" title="Сессия утверждена">
						<CircleRounded sx={{ color: "#00BFA5" }} />
					</Tooltip>
				);
			default:
				return (
					<Tooltip placement="top-start" title="Нет доступных сессий">
						<CircleRounded sx={{ color: "#E2E2E2" }} />
					</Tooltip>
				);
		}
	};

	const itemMenu = () => {
		switch (loggedUser.role) {
			case "dekan":
				if (item !== null) {
					switch (item.approveStatus) {
						case 60:
							return (
								<Menu
									onClose={handleClose}
									open={open}
									anchorEl={anchorEl}
									transformOrigin={{
										horizontal: "right",
										vertical: "top",
									}}
									anchorOrigin={{
										horizontal: "right",
										vertical: "bottom",
									}}
								>
									<MenuItem onClick={handleClose}>
										Управление внеплановыми пересдачами
									</MenuItem>
									<MenuItem onClick={handleClose}>
										Отправить на утверждение
									</MenuItem>
									{/* Заглушка */}
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/main/create-session/3"
									>
										Редактировать сессию
									</MenuItem>
									<MenuItem
										onClick={handleClose}
										component={Link}
										to="/main/session-timing"
									>
										Редактировать расписание
									</MenuItem>
								</Menu>
							);
						default:
							return (
								<Menu
									onClose={handleClose}
									open={open}
									anchorEl={anchorEl}
									transformOrigin={{
										horizontal: "right",
										vertical: "top",
									}}
									anchorOrigin={{
										horizontal: "right",
										vertical: "bottom",
									}}
								>
									<MenuItem onClick={handleClose}>
										Управление внеплановыми пересдачами
									</MenuItem>
									<MenuItem onClick={handleClose}>
										Управление ведомостями
									</MenuItem>
									<MenuItem onClick={handleClose}>
										Редактировать расписание задач
									</MenuItem>
									<MenuItem onClick={handleClose}>
										Приостановить сессию
									</MenuItem>
									<Divider />
									<MenuItem onClick={handleClose}>
										Печать расписание зачётов/экзаменов
									</MenuItem>
									<MenuItem onClick={handleClose}>
										Печать расписания задач
									</MenuItem>
								</Menu>
							);
					}
				}
				break;
			case "umu":
				if (item !== null) {
					return (
						<Menu
							onClose={handleClose}
							open={open}
							anchorEl={anchorEl}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
						>
							<MenuItem
								onClick={handleClose}
								component={Link}
								to="/main/session-details"
							>
								Подробные сведения
							</MenuItem>
							<MenuItem>Печать расписания</MenuItem>
							<MenuItem>Печать расписания пересдач</MenuItem>
						</Menu>
					);
				}
				break;
			default:
				return <></>;
		}
	};

	const actionControl = (item, groupIndex, itemIndex) => {
		if (
			item.checksStartDate !== null &&
			item.examsStartDate !== null &&
			item.holidayStartDate !== null
		) {
			return (
				<>
					<IconButton
						onClick={handleClick}
						data-item={itemIndex}
						data-group={groupIndex}
					>
						<MoreVertRounded />
					</IconButton>
				</>
			);
		}
		return (
			<Button
				variant="text"
				onClick={handleCreate}
				data-course={item.courseNumber}
			>
				Создать сессию
			</Button>
		);
	};

	const dekanTable = () => {
		return data.map((item, groupIndex) => (
			<Fragment key={groupIndex}>
				<TableRow>
					<TableCell colSpan={7} sx={{ fontWeight: "bold" }}>
						{item.name}
					</TableCell>
				</TableRow>
				{item.data.map((group, itemIndex) => {
					return (
						<TableRow key={itemIndex} hover>
							<TableCell>{indicator(group)}</TableCell>
							<TableCell>{group.courseNumber}</TableCell>
							<TableCell>{group.groups?.join(", ")}</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>
								{formatRange(
									group.checksStartDate,
									group.checksEndDate,
								)}
							</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>
								{formatRange(
									group.examsStartDate,
									group.examsEndDate,
								)}
							</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>
								{formatRange(
									group.holidayStartDate,
									group.holidayEndDate,
								)}
							</TableCell>
							<TableCell sx={{ textAlign: "right" }}>
								{actionControl(group, groupIndex, itemIndex)}
							</TableCell>
						</TableRow>
					);
				})}
			</Fragment>
		));
	};

	const umuTable = () => {
		return data.map((f, index) => (
			<Fragment key={index}>
				<TableRow>
					<TableCell colSpan={7}>{f.name}</TableCell>
				</TableRow>
				{f.disciplines.map((d, dindex) => {
					return (
						<Fragment key={dindex}>
							<TableRow>
								<TableCell colSpan={7}>
									{d.discipline}
								</TableCell>
							</TableRow>
							{d.sessions.map((s, sindex) => (
								<TableRow key={sindex}>
									<TableCell>{indicator(s)}</TableCell>
									<TableCell>{s.courseNumber}</TableCell>
									<TableCell>{s.groups.join(", ")}</TableCell>
									<TableCell>
										{formatRange(
											s.checksStartDate,
											s.checksEndDate,
										)}
									</TableCell>
									<TableCell>
										{formatRange(
											s.examsStartDate,
											s.examsEndDate,
										)}
									</TableCell>
									<TableCell>
										{formatRange(
											s.holidayStartDate,
											s.holidayEndDate,
										)}
									</TableCell>
									<TableCell sx={{ textAlign: "right" }}>
										{actionControl(s, dindex, sindex)}
									</TableCell>
								</TableRow>
							))}
						</Fragment>
					);
				})}
			</Fragment>
		));
	};

	const tableContent = () => {
		if (loggedUser.role === "dekan") {
			return dekanTable();
		} else {
			return umuTable();
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

	const handleFacultyChange = (e) => {
		setFaculty(e.target.value);
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
						control={<Checkbox />}
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
						<CardContent>
							{umuFilters()}
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell></TableCell>
											<TableCell>Курс</TableCell>
											<TableCell>Группа</TableCell>
											<TableCell>
												Зачётная неделя
											</TableCell>
											<TableCell>Экзамены</TableCell>
											<TableCell>Каникулы</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												Действия
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{tableContent()}</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</div>
			</section>
			{itemMenu()}
		</main>
	);
}

export default SessionManager;
