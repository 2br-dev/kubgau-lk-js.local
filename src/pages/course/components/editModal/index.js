import React, { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Tab,
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	Tabs,
	TextField,
	Button,
	MenuItem,
	Link,
	Select,
} from "@mui/material";
import {
	CheckRounded,
	CloseRounded,
	DeleteRounded,
	EditRounded,
	PlaylistAddRounded,
} from "@mui/icons-material";
import { useEffect } from "react";
import "./index.scss";

EditModal.propTypes = {
	course: PropTypes.object,
	handleSave: PropTypes.func,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
};

function EditModal(props) {
	const modalClass = props.open ? "modal-wrapper open" : "modal-wrapper";
	const [data, setData] = useState({
		disciplineName: "",
		groupFlowBindings: [],
	});
	const [tabVal, setTabVal] = useState(6);
	const [hours4all, setHours4all] = useState(32);
	const [bindings, setBindins] = useState([]);
	const [filteredBindings, setFilteredBindings] = useState([]);
	const [teachers, setTeachers] = useState([]);

	const filterBindings = useCallback(
		(vals, tab = tabVal) => {
			return vals.filter(
				(item) => (item.lessonType === 4 ? 3 : item.lessonType) === tab,
			);
		},
		[tabVal],
	);

	useEffect(() => {
		if (props.open) {
			fetch("/data/editCourse.json")
				.then((res) => res.json())
				.then((response) => {
					setData(response.data);

					response.data.groupFlowBindings.forEach((b) => {
						b.mode = "view";
						b.groupFlowTeams.forEach((g) => {
							g.mode = "view";
						});
					});

					setBindins(response.data.groupFlowBindings);
					let filtered = filterBindings(
						response.data.groupFlowBindings,
					);
					setFilteredBindings(filtered);
					setTeachers([...new Set(response.availableEmployees)]);
				});
		}
	}, [props.open, filterBindings]);

	const handleClose = () => {
		props.handleClose();
	};

	const handleTabChange = (e, newVal) => {
		setTabVal(newVal);
		const filtered = filterBindings(bindings, newVal);
		setFilteredBindings(filtered);
	};

	const handleAllHoursChange = (e) => {
		setHours4all(e.target.value);
	};

	const saveRow = (e) => {
		const disciplineIndex = parseInt(e.currentTarget.dataset.discipline);
		const group = parseInt(e.currentTarget.dataset.group);

		let _filteredBindings = [...filteredBindings];
		_filteredBindings[disciplineIndex].groupFlowTeams[group].mode = "view";
		setFilteredBindings(_filteredBindings);
	};

	const handleReset = () => {
		fetch("/data/editCourse.json")
			.then((res) => res.json())
			.then((response) => {
				setData(response.data);

				response.data.groupFlowBindings.forEach((b) =>
					b.groupFlowTeams.forEach((g) => {
						g.mode = "view";
					}),
				);

				setBindins(response.data.groupFlowBindings);
				let filtered = filterBindings(response.data.groupFlowBindings);
				setFilteredBindings(filtered);
				setTeachers(response.availableEmployees);
			});
	};

	const getTeacher = (jobId) => {
		return teachers.filter((t) => t.jobId === jobId)[0];
	};

	const setDisciplineMode = (e) => {
		const discipline = parseInt(e.currentTarget.dataset.index);
		const _filteredBindings = [...filteredBindings];
		const item2edit = _filteredBindings[discipline];
		item2edit.mode = item2edit.mode === "edit" ? "view" : "edit";
		setFilteredBindings(_filteredBindings);
	};

	const setDisciplineHours = (e) => {
		const discipline = parseInt(e.currentTarget.dataset.discipline);
		const hours = e.currentTarget.value;
		const _filteredBindings = [...filteredBindings];
		_filteredBindings[discipline].hours = hours;
		setFilteredBindings(_filteredBindings);
	};

	const addGroup = (e) => {
		e.preventDefault();
		let index = parseInt(e.target.dataset.index);
		let _filteredBindings = [...filteredBindings];

		_filteredBindings[index].groupFlowTeams.push({
			groupFlowTeamId: null,
			groupFlowTeamName: "",
			jobId: null,
			mode: "edit",
		});
		setFilteredBindings(_filteredBindings);
	};

	const rowHeader = (b, index) => {
		const icon = b.mode === "view" ? <EditRounded /> : <CheckRounded />;

		const hoursVal =
			b.mode === "view" ? (
				<strong>
					{b.groupName} ({b.hours} ч.)
					<IconButton
						size="small"
						onClick={setDisciplineMode}
						data-index={index}
					>
						{icon}
					</IconButton>
				</strong>
			) : (
				<>
					<strong>{b.groupName}</strong>
					<TextField
						size="small"
						variant="standard"
						value={b.hours}
						inputProps={{ "data-discipline": index }}
						onChange={setDisciplineHours}
						sx={{
							marginLeft: "6px",
							width: "40px",
							transform: "translateY(2px)",
						}}
					/>
					<IconButton
						size="small"
						onClick={setDisciplineMode}
						data-index={index}
					>
						{icon}
					</IconButton>
				</>
			);

		if (tabVal !== 1) {
			return (
				<>
					<TableCell colSpan={2} data-id={index}>
						{hoursVal}
					</TableCell>
					<TableCell
						data-id={index}
						style={{ textAlign: "right", whiteSpace: "nowrap" }}
					></TableCell>
				</>
			);
		}
		if (b.mode === "view") {
			return (
				<>
					<TableCell colSpan={2}>
						<strong>
							{b.groupName} ({b.hours} ч.)
						</strong>
						<IconButton
							onClick={setDisciplineMode}
							data-index={index}
						>
							<EditRounded />
						</IconButton>
					</TableCell>
					<TableCell
						colSpan={1}
						sx={{ textAlign: "right", whiteSpace: "nowrap" }}
					>
						<Link
							href="#!"
							onClick={addGroup}
							data-index={index}
							sx={{
								display: "inline-flex",
								alignItems: "center",
							}}
						>
							Добавить группу{" "}
							<PlaylistAddRounded sx={{ marginLeft: "6px" }} />
						</Link>
					</TableCell>
				</>
			);
		}
		return (
			<>
				<TableCell colSpan={2}>
					<strong>{b.groupName}</strong>
					<TextField
						size="small"
						variant="standard"
						value={b.hours}
						sx={{
							marginLeft: "6px",
							width: "40px",
							transform: "translateY(6px)",
						}}
						inputProps={{ "data-discipline": index }}
						onChange={setDisciplineHours}
					/>
					<IconButton onClick={setDisciplineMode} data-index={index}>
						{icon}
					</IconButton>
				</TableCell>
				<TableCell colSpan={1} sx={{ textAlign: "right" }}>
					<Link
						sx={{
							display: "inline-flex",
							alignItems: "center",
						}}
					>
						Добавить группу{" "}
						<PlaylistAddRounded sx={{ marginLeft: "6px" }} />
					</Link>
				</TableCell>
			</>
		);
	};

	const handleSave = () => {
		props.handleSave(data);
	};

	const setMode = (e) => {
		const newFilteredBindings = [...filteredBindings];
		const discipline = parseInt(e.currentTarget.dataset.discipline);
		const groupIndex = parseInt(e.currentTarget.dataset.group);
		let _item2edit =
			newFilteredBindings[discipline].groupFlowTeams[groupIndex];
		_item2edit.mode = _item2edit.mode === "edit" ? "view" : "edit";
		setFilteredBindings(newFilteredBindings);
	};

	const setTeacher = (e, newVal) => {
		const props = newVal.props;

		const _filteredBindings = [...filteredBindings];
		const item2edit =
			// eslint-disable-next-line react/prop-types
			_filteredBindings[props.discipline].groupFlowTeams[props.group];

		item2edit.jobId = e.target.value;

		setFilteredBindings(_filteredBindings);
	};

	const setGroupName = (e) => {
		const discipline = parseInt(e.target.dataset.discipline);
		const group = parseInt(e.target.dataset.group);

		let _filteredBindings = [...filteredBindings];
		const item = _filteredBindings[discipline].groupFlowTeams[group];
		item.groupFlowTeamName = e.target.value;
		setFilteredBindings(_filteredBindings);
	};

	const removeGroup = (e) => {
		let discipline = parseInt(e.currentTarget.dataset.discipline);
		let group = parseInt(e.currentTarget.dataset.group);

		let _fileteredBindings = [...filteredBindings];
		let disciplineEntry = _fileteredBindings[discipline];

		disciplineEntry.groupFlowTeams.splice(group, 1);

		setFilteredBindings(_fileteredBindings);
	};

	const itemRow = (team, disciplineIndex, groupIndex) => {
		const removeControl =
			tabVal === 1 ? (
				<IconButton
					onClick={removeGroup}
					data-discipline={disciplineIndex}
					data-group={groupIndex}
				>
					<DeleteRounded />
				</IconButton>
			) : (
				<></>
			);

		if (team.mode === "view") {
			return (
				<TableRow key={groupIndex}>
					<TableCell>{team.groupFlowTeamName}</TableCell>
					<TableCell>{getTeacher(team.jobId)?.fullName}</TableCell>
					<TableCell
						sx={{ textAlign: "right", whiteSpace: "nowrap" }}
					>
						<IconButton
							data-discipline={disciplineIndex}
							data-group={groupIndex}
							onClick={setMode}
							size="small"
						>
							<EditRounded />
						</IconButton>
						{removeControl}
					</TableCell>
				</TableRow>
			);
		}
		return (
			<TableRow className="edit" key={groupIndex}>
				<TableCell>
					<TextField
						variant="standard"
						value={team.groupFlowTeamName}
						onChange={setGroupName}
						inputProps={{
							"data-discipline": disciplineIndex,
							"data-group": groupIndex,
						}}
					/>
				</TableCell>
				<TableCell>
					<Select
						MenuProps={{
							style: {
								maxHeight: 400,
							},
						}}
						value={team.jobId}
						onChange={setTeacher}
						fullWidth
						variant="standard"
					>
						{teachers.map((t, index) => {
							return (
								<MenuItem
									key={index}
									value={t.jobId}
									group={groupIndex}
									discipline={disciplineIndex}
								>
									{t.fullName}
								</MenuItem>
							);
						})}
					</Select>
				</TableCell>
				<TableCell sx={{ textAlign: "right" }}>
					<IconButton
						data-discipline={disciplineIndex}
						data-group={groupIndex}
						size="small"
						onClick={saveRow}
					>
						<CheckRounded />
					</IconButton>
					{removeControl}
				</TableCell>
			</TableRow>
		);
	};

	const tableBody = () => {
		if (filteredBindings.length) {
			return filteredBindings.map((b, index) => (
				<Fragment key={index}>
					<TableRow
						key={index}
						className={b.mode === "view" ? "view" : "edit"}
					>
						{rowHeader(b, index)}
					</TableRow>
					{b.groupFlowTeams.map((team, groupIndex) =>
						itemRow(team, index, groupIndex),
					)}
				</Fragment>
			));
		}

		return (
			<TableRow>
				<TableCell
					colSpan={4}
					sx={{ textAlign: "center", padding: "4vmax" }}
				>
					Нет данных для отображения
				</TableCell>
			</TableRow>
		);
	};

	const setUnionVal = () => {
		const _filteredBindings = [...filteredBindings];
		_filteredBindings.forEach((b) => {
			b.hours = hours4all;
		});
		setFilteredBindings(_filteredBindings);
	};

	const hasEditItems = () => {
		let val = false;
		filteredBindings.forEach((d) => {
			if (d.mode === "edit") val = true;

			d.groupFlowTeams.forEach((g) => {
				if (g.mode === "edit") val = true;
			});
		});

		return val;
	};

	return (
		<div className={modalClass}>
			<div className="modal" style={{ maxWidth: "1000px" }}>
				<div className="modal-header">
					<div className="name">
						<p style={{ marginTop: 0 }}>
							{data.disciplineName}
							<span
								style={{ fontSize: "16px", fontWeight: "400" }}
							>
								{" "}
								(редактирование)
							</span>
						</p>
					</div>
					<IconButton onClick={handleClose}>
						<CloseRounded />
					</IconButton>
				</div>
				<Tabs
					variant="scrollable"
					value={tabVal}
					onChange={handleTabChange}
				>
					<Tab disabled={hasEditItems()} label="Лекции" value={6} />
					<Tab
						disabled={hasEditItems()}
						label="Практические занятия"
						value={3}
					/>
					<Tab
						disabled={hasEditItems()}
						label="Лабораторные занятия"
						value={1}
					/>
				</Tabs>
				<div
					style={{
						margin: "20px 0",
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<TextField
						variant="standard"
						sx={{
							width: "80px",
							marginRight: "20px",
							paddingBottom: "6px",
						}}
						label="Часы"
						value={hours4all}
						onChange={handleAllHoursChange}
					/>
					<Button onClick={setUnionVal} variant="text">
						Установить для всех
					</Button>
				</div>
				<TableContainer sx={{ maxHeight: "300px" }}>
					<Table
						className="simple-table"
						size="small"
						sx={{ borderCollapse: "unset" }}
					>
						<TableHead>
							<TableRow>
								<TableCell>Группа/подгруппа</TableCell>
								<TableCell>Преподаватель</TableCell>
								<TableCell sx={{ textAlign: "right" }}>
									Действия
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{tableBody()}</TableBody>
					</Table>
				</TableContainer>
				<div
					className={
						hasEditItems()
							? "modal-footer disabled"
							: "modal-footer"
					}
				>
					<Button variant="text" onClick={handleReset}>
						Сброс
					</Button>
					<Button variant="text" onClick={handleSave}>
						Сохранить
					</Button>
				</div>
			</div>
		</div>
	);
}

export default EditModal;
