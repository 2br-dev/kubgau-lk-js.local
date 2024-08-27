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
	const [item, setItem] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleCreate = (e) => {
		let courseId = parseInt(e.target.dataset.course);
		navigate(`/main/create-session/${courseId}`);
	};

	useEffect(() => {
		fetch("/data/sessions.json")
			.then((res) => res.json())
			.then((response) => setData(groupData(response.data)));
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

	const suffix = (
		<Button variant="contained" color="primary">
			Студенты-задолжники
		</Button>
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

	const tableContent = () => {
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
							<TableCell>{group.groups.join(", ")}</TableCell>
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

	const groupData = (data) => {
		const disciplines = data.map((d) => d.programOfEducationName);
		const groups = [...new Set(disciplines)];

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
