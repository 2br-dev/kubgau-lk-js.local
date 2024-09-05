import React, { useState, useEffect } from "react";
import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Menu,
	MenuItem,
	Divider,
} from "@mui/material";
import { Fragment } from "react";
import indicator from "./indicator";
import formatRange from "../../../components/formatDate";
import ActionControl from "./actionControl";
import { useNavigate, Link } from "react-router-dom";

function DekanTable() {
	const navigate = useNavigate();
	const [item, setItem] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [data, setData] = useState([]);
	const open = Boolean(anchorEl);

	useEffect(() => {
		fetch("/data/sessions.json")
			.then((res) => res.json())
			.then((response) => {
				setData(groupData(response.data));
			});
	});

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

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (e) => {
		const groupId = parseInt(e.currentTarget.dataset.group);
		const itemId = parseInt(e.currentTarget.dataset.item);
		setItem(data[groupId].data[itemId]);
		setAnchorEl(e.currentTarget);
	};

	const handleCreate = (e) => {
		let courseId = parseInt(e.target.dataset.course);
		navigate(`/main/create-session/${courseId}`);
	};

	const itemMenu = () => {
		if (!item) {
			return <></>;
		}
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
						<MenuItem
							onClick={handleClose}
							component={Link}
							to="/main/outplan-repasses"
						>
							Управление внеплановыми пересдачами
						</MenuItem>
						<MenuItem
							onClick={handleClose}
							component={Link}
							to={"/main/dekan-statements"}
						>
							Управление ведомостями
						</MenuItem>
						<MenuItem onClick={handleClose}>
							Редактировать расписание задач
						</MenuItem>
						<MenuItem
							onClick={handleClose}
							component={Link}
							to="/main/suspend-session"
						>
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
	};

	const tableBody = () => {
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
								<ActionControl
									item={group}
									groupIndex={groupIndex}
									itemIndex={itemIndex}
									handleClick={handleClick}
									handleCreate={handleCreate}
								/>
							</TableCell>
						</TableRow>
					);
				})}
			</Fragment>
		));
	};

	return (
		<>
			<TableContainer>
				<Table className="simple-table">
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Курс</TableCell>
							<TableCell>Группа</TableCell>
							<TableCell>Зачётная неделя</TableCell>
							<TableCell>Экзамены</TableCell>
							<TableCell>Каникулы</TableCell>
							<TableCell sx={{ textAlign: "right" }}>
								Действия
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{tableBody()}</TableBody>
				</Table>
			</TableContainer>
			{itemMenu()}
		</>
	);
}

export default DekanTable;
