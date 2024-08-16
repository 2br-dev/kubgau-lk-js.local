import React from "react";
import PropTypes from "prop-types";
import {
	Button,
	IconButton,
	Grid,
	Select,
	InputLabel,
	FormControl,
	MenuItem,
	TextField,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Tooltip,
} from "@mui/material";
import { AddRounded, BlockRounded, CloseRounded } from "@mui/icons-material";
import { useState, useEffect } from "react";

VirtaulGroupModal.propTypes = {
	open: PropTypes.bool,
	mode: PropTypes.string,
	group: PropTypes.object,
	handleClose: PropTypes.func,
	handleSave: PropTypes.func,
};

function VirtaulGroupModal(props) {
	// Инициализация
	const [group, setGroup] = useState({
		virtualGroupName: "",
		students: [],
		disciplineId: null,
		groupId: null,
		inMyGroup: false,
	});
	const [groupName, setGroupName] = useState([]);
	const [availableStudents, setAvailableStudents] = useState([]);
	const [disciplines, setDisciplines] = useState([]);
	const [groups, setGroups] = useState([]);
	const [filteredStudents, setFilteredStudents] = useState([]);
	const [studentFilter, setStudentFilter] = useState("");
	const [disciplineFilter, setDisciplineFilter] = useState("");
	const [groupFilter, setGroupFilter] = useState("");

	// Заглушка
	const loggedUser = "Татьяна Анатольевна Шевцова";

	useEffect(() => {
		if (props.group) {
			setGroup(props.group);
			setDisciplineFilter(null);
			setGroups([]);

			setAvailableStudents([]);
			setFilteredStudents([]);
			setGroupName(props.group.virtualGroupName);

			// Загрузка перечня дисциплин
			fetch("/data/disciplines.json")
				.then((res) => res.json())
				.then((response) => {
					setDisciplines(response);
				});
		}
	}, [props.group]);

	useEffect(() => {
		if (disciplineFilter !== "" && disciplineFilter !== null) {
			setGroupName("");
			setGroups([]);

			fetch("/data/available_students.json")
				.then((res) => res.json())
				.then((response) => {
					setAvailableStudents(response.data);
					setFilteredStudents(response.data);

					const _groups = response.data.map((s) => {
						return s.attachedToSubGroup;
					});

					const _groupsUniq = [...new Set(_groups)].filter(
						(el) => el !== null,
					);
					setGroups(_groupsUniq);
				})
				.catch((err) => console.error(err));
		}
	}, [disciplineFilter]);

	// Обработка закрытия модального окна
	const handleClose = () => {
		props.handleClose?.();
	};

	// Обработка сохранения
	const handleSave = () => {
		props.handleSave?.(group);
	};

	// Обработка изменения имени
	const handleChangeGroup = (e) => {
		setGroupName(e.target.value);

		let newGroup = { ...group };
		newGroup.virtualGroupName = e.target.value;
		setGroup(newGroup);
	};

	// Обработка изменения дисциплины
	const handleChangeDiscipline = (e) => {
		setGroupFilter("");
		setDisciplineFilter(e.target.value);
	};

	// Имя с инициалами
	const shortName = (studentName) => {
		const nameArr = studentName.split(" ");
		const shortName = nameArr.map((part, index) => {
			return [index === 0 ? part : part[0] + "."];
		});
		return shortName.join(" ");
	};

	// Кнопка действий в доступных студентах
	const availableAction = (student, index) => {
		if (group) {
			if (
				student.attachedToEmployee !== loggedUser &&
				student.attachedToEmployee !== null
			) {
				return (
					<Tooltip
						placement="top"
						title={
							<React.Fragment>
								<div>
									Преподаватель: {student.attachedToEmployee}
								</div>
								<div>Группа: {student.attachedToSubGroup}</div>
							</React.Fragment>
						}
					>
						<IconButton>
							<BlockRounded />
						</IconButton>
					</Tooltip>
				);
			} else {
				if (
					student.attachedToEmployee === loggedUser &&
					student.attachedToSubGroup === group.virtualGroupName
				) {
					return (
						<Tooltip placement="top" title="Исключить из группы">
							<IconButton data-id={index} color="primary">
								<CloseRounded />
							</IconButton>
						</Tooltip>
					);
				} else {
					return (
						<Tooltip placement="top" title="Добавить в группу">
							<IconButton color="primary">
								<AddRounded />
							</IconButton>
						</Tooltip>
					);
				}
			}
		}
	};

	// Вывод доступных студентов
	const availableStudentsTable = () => {
		return filteredStudents.map((student, index) => (
			<TableRow key={index}>
				<TableCell>
					<Tooltip placement="top" title={student.fullName}>
						<span>{shortName(student.fullName)}</span>
					</Tooltip>
				</TableCell>
				<TableCell sx={{ textAlign: "right" }}>
					{availableAction(student, index)}
				</TableCell>
			</TableRow>
		));
	};

	const handleChangeFilter = (e) => {
		setGroupFilter(e.target.value);
	};

	// Обработка ввода имени студента
	const handleStudentInput = (e) => {
		setStudentFilter(e.target.value);
	};

	return (
		<div className={props.open ? "modal-wrapper open" : "modal-wrapper"}>
			<div className="modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="name">
							Редактирование группы{" "}
							{props.group?.virtualGroupName}
						</div>
						<IconButton onClick={handleClose}>
							<CloseRounded />
						</IconButton>
					</div>
					<Grid container columnSpacing={2}>
						<Grid item sm={6} xs={12}>
							<div>
								<strong>Список студентов</strong>
							</div>
							<FormControl
								variant="standard"
								sx={{ width: "100%" }}
							>
								<InputLabel>Дисциплина</InputLabel>
								<Select
									onChange={handleChangeDiscipline}
									value={disciplineFilter || ""}
								>
									{disciplines.map((d, i) => (
										<MenuItem value={d.key} key={i}>
											{d.value}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl
								variant="standard"
								sx={{ width: "100%" }}
							>
								<InputLabel>Группа</InputLabel>
								<Select
									value={groupFilter}
									onChange={handleChangeFilter}
								>
									{groups.map((group, index) => (
										<MenuItem value={group} key={index}>
											{group}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								sx={{ width: "100%" }}
								variant="standard"
								label="Поиск студента"
								value={studentFilter}
								onChange={handleStudentInput}
							/>
							<div
								className="available-list"
								style={{ maxHeight: "260px", overflow: "auto" }}
							>
								<Table size="small" className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>ФИО</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												!
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{availableStudentsTable()}
									</TableBody>
								</Table>
							</div>
						</Grid>
						<Grid item sm={6} xs={12}>
							<div>
								<strong>Ваша группа</strong>
							</div>
							<TextField
								sx={{ width: "100%" }}
								value={groupName}
								label="Название группы"
								variant="standard"
								onChange={handleChangeGroup}
							/>
						</Grid>
					</Grid>
				</div>
				<div className="modal-footer">
					<span></span>
					<Button variant="text" onClick={handleSave}>
						Сохранить
					</Button>
				</div>
			</div>
		</div>
	);
}

export default VirtaulGroupModal;
