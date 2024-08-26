import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
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
	AddRounded,
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

	useEffect(() => {
		fetch("/data/sessions.json")
			.then((res) => res.json())
			.then((response) => setData(groupData(response.data)));
	}, []);

	const toDate = (dateStr) => {
		if (dateStr !== null) {
			const dateArr = dateStr.split(".");
			return new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
		}
		return null;
	};

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
			case item.approveStatus === null:
				return (
					<Tooltip placement="top-start" title="Нет доступных сессий">
						<CircleRounded sx={{ color: "#E2E2E2" }} />
					</Tooltip>
				);
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
		}
	};

	const formatRange = (from, to) => {
		const monthes = [
			"янв",
			"фев",
			"мар",
			"апр",
			"мая",
			"июн",
			"июл",
			"авг",
			"сен",
			"окт",
			"ноя",
			"дек",
		];

		const start = toDate(from);
		const end = toDate(to);

		const startIsCorrect = from !== null;
		const endIsCorrect = to !== null;
		let output = "";

		if (startIsCorrect && endIsCorrect) {
			const ds = start.getDate();
			const de = end.getDate();

			const ms = start.getMonth();
			const me = end.getMonth();

			const ys = start.getFullYear();
			const ye = end.getFullYear();

			output += ds.toString();

			if (ms !== me) {
				output += " " + monthes[ms];
			}

			if (ys !== ye) {
				output += " " + ye.toString() + " г.";
			}

			output += ` – ${de} ${monthes[me]} ${ye} г.`;
		}

		return output;
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
							<MenuItem onClick={handleClose}>
								Редактировать сессию
							</MenuItem>
							<MenuItem onClick={handleClose}>
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
			<>
				<IconButton>
					<AddRounded />
				</IconButton>
			</>
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
