import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
	Switch,
	Select,
	Button,
	MenuItem,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
	ThemeProvider,
	TextField,
} from "@mui/material";
import {
	AttachmentRounded,
	CloseRounded,
	DeleteRounded,
} from "@mui/icons-material";
import "./index.scss";
import {
	toggleTheme,
	criticalTheme,
	warningTheme,
	successTheme,
} from "../../../../components/toggleTheme";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import KVPair from "../../../../components/kv_pair";
import React from "react";
import PropTypes from "prop-types";
import studentAbsent from "../student_absent";

ValueModal.propTypes = {
	student: PropTypes.object,
	day: PropTypes.number,
	closeHandler: PropTypes.func,
	saveHandler: PropTypes.func,
	open: PropTypes.bool,
};

function ValueModal(props) {
	dayjs.locale("ru");
	const [student, setStudent] = useState(null);
	const originalStudent = { ...props.student };

	useEffect(() => {
		let newStudentString = JSON.stringify(props.student);
		let newStudent = JSON.parse(newStudentString);
		setStudent(newStudent);
	}, [props.student, props.day]);

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

	const addEmptyButton = () => {
		if (student) {
			let vals = student.lessons[props.day].grades;
			if (vals.length === 0) {
				return <Button onClick={addValue}>Добавить оценку</Button>;
			}
			return <></>;
		}
	};

	const closeModal = () => {
		props.closeHandler(originalStudent);
	};

	const setPresenceState = (e) => {
		let newStudent = { ...student };
		let day = newStudent.lessons[props.day];
		day.attended = !e.target.checked;
		newStudent.lessons[props.day] = day;
		setStudent(newStudent);
	};

	const saveStudent = () => {
		let newStudent = { ...student };
		setStudent(newStudent);
		props.saveHandler(student);
	};

	const handleValue = (e, newVal) => {
		if (newVal === null) return;
		let newStudent = { ...student };
		let newVals = newStudent.lessons[props.day].grades;
		let currentVal = parseInt(e.target.dataset["value"]);
		let val = newVals[currentVal];
		val.grade = newVal;
		newStudent.lessons[props.day].grades = newVals;
		setStudent(newStudent);
	};

	const removeVal = (e) => {
		let newStudent = { ...student };
		let newVals = newStudent.lessons[props.day].grades;
		let index = parseInt(e.target.dataset["value"]);
		newVals.splice(index, 1);
		newStudent.lessons[props.day].grades = newVals;
		setStudent(newStudent);
	};

	const addValue = () => {
		let newStudent = { ...student };
		let newVal = {
			grade: 5,
			gradeType: 0,
		};
		if (newStudent.lessons[props.day].grades.length <= 3) {
			newStudent.lessons[props.day].grades.push(newVal);
			setStudent(newStudent);
		}
	};

	const date = (type) => {
		if (student) {
			if (student.lessons && props.day !== null) {
				if (type === "date") {
					let stringDate = dayjs(student.lessons[props.day].date);
					return stringDate.format("D MMMM YYYY г.");
				}

				if (type === "class") return studentAbsent(student, props.day);

				if (type === "values") return student.lessons[props.day].grades;
			}
		}

		return "";
	};

	const handleVlaueType = (newVal, event) => {
		let newStudent = { ...student };
		let valIndex = event.props["data-val"];
		newStudent.lessons[props.day].grades[valIndex].gradeType =
			newVal.target.value;
		setStudent(newStudent);
	};

	const values = () => {
		let vals = date("values");

		if (typeof vals === "object") {
			return vals.map((value, index) => (
				<div className="value-wrapper" key={index}>
					<div className="value-type" data-val={index}>
						<Select
							onChange={handleVlaueType}
							label="Тип оценки"
							variant="standard"
							value={value.gradeType.toString()}
							sx={{ width: "100%" }}
						>
							<MenuItem data-val={index} value={0}>
								Тестирование
							</MenuItem>
							<MenuItem data-val={index} value={1}>
								Лабораторная работа
							</MenuItem>
							<MenuItem data-val={index} value={2}>
								Контрольная работа
							</MenuItem>
							<MenuItem data-val={index} value={3}>
								Расчётно-графическая работа
							</MenuItem>
							<MenuItem data-val={index} value={4}>
								Домашняя работа
							</MenuItem>
							<MenuItem data-val={index} value={5}>
								Другое
							</MenuItem>
						</Select>
					</div>
					<div className="value">
						<ToggleButtonGroup
							sx={{ width: "100%" }}
							exclusive
							value={value.grade}
							onChange={handleValue}
						>
							<ThemeProvider theme={successTheme}>
								<ToggleButton
									size="small"
									value={5}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									5
								</ToggleButton>
							</ThemeProvider>
							<ThemeProvider theme={successTheme}>
								<ToggleButton
									size="small"
									value={4}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									4
								</ToggleButton>
							</ThemeProvider>
							<ThemeProvider theme={warningTheme}>
								<ToggleButton
									size="small"
									value={3}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									3
								</ToggleButton>
							</ThemeProvider>
							<ThemeProvider theme={criticalTheme}>
								<ToggleButton
									size="small"
									value={2}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									Неуд
								</ToggleButton>
							</ThemeProvider>
						</ToggleButtonGroup>
					</div>
					<div className="value-actions">
						<Button
							variant="text"
							sx={{ color: "red" }}
							data-value={index}
							onClick={removeVal}
						>
							Удалить
						</Button>
						<Button
							variant="text"
							disabled={
								student.lessons[props.day].grades.length >= 3
							}
							onClick={addValue}
						>
							Добавить
						</Button>
					</div>
				</div>
			));
		}
	};

	const handleFile = (e) => {
		const file = e.target.files[0];
		let newStudent = { ...student };
		let day = newStudent.lessons[props.day];
		day.class = studentAbsent(newStudent, props.day);
		day.absent_link = file ? file.name : "Выберите файл";
		newStudent.lessons[props.day] = day;
		setStudent(newStudent);
	};

	const clearFile = () => {
		let newStudent = { ...student };
		let day = newStudent.lessons[props.day];
		day.class = studentAbsent(newStudent, props.day);
		day.absent_link = "";
		newStudent.lessons[props.day] = day;

		setStudent(newStudent);
	};

	const inputLabel = () => {
		let clearFileClass =
			student.lessons[props.day].absent_link === null ||
			student.lessons[props.day].absent_link === ""
				? "clear-file hide"
				: "clear-file";
		return (
			<label htmlFor="reason_file" className="file-wrapper">
				<div className="file-label">
					<AttachmentRounded />
					<span>
						{student.lessons[props.day].absent_link ||
							"Выберите файл"}
					</span>
				</div>
				<div className="clear-wrapper">
					<IconButton onClick={clearFile} className={clearFileClass}>
						<DeleteRounded />
					</IconButton>
				</div>
			</label>
		);
	};

	const commentChange = (e) => {
		let newStudent = { ...student };
		let day = newStudent.lessons[props.day];
		day.absent_reason = e.target.value;
		day.class = studentAbsent(newStudent, props.day);
		newStudent.lessons[props.day] = day;
		setStudent(newStudent);
	};

	const docnameChange = (e) => {
		let newStudent = { ...student };
		let day = newStudent.lessons[props.day];
		day.absent_doc = e.target.value;
		day.class = studentAbsent(newStudent, props.day);
		newStudent.lessons[props.day] = day;
		setStudent(newStudent);
	};

	const clearValues = () => {
		let newStudent = { ...student };
		newStudent.lessons[props.day].grades = [];
		setStudent(newStudent);
	};

	const reason = () => {
		let className = date("class");
		let reasonClass = className === "" ? "reasons hide" : "reasons";
		if (student) {
			return (
				<div className={reasonClass}>
					<div className="reason-block">
						<TextField
							sx={{ width: "100%" }}
							onChange={docnameChange}
							variant="standard"
							value={student.lessons[props.day].absent_doc}
							label="Название документа"
						/>
					</div>
					<div className="reason-block">
						<input
							type="file"
							id="reason_file"
							style={{ display: "none" }}
							onChange={handleFile}
						/>
						{inputLabel()}
					</div>
					<div className="reason-block">
						<TextField
							sx={{ width: "100%" }}
							onChange={commentChange}
							multiline={true}
							variant="standard"
							value={
								student.lessons[props.day].absent_reason || ""
							}
							label="Комментарий"
						/>
					</div>
				</div>
			);
		}
		return <></>;
	};

	return (
		<div
			className={props.open ? "modal-wrapper open" : "modal-wrapper"}
			id="value-modal"
		>
			<div className="modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="name">
							{student?.lastName} {student?.firstName}{" "}
							{student?.middleName}
						</div>
						<IconButton onClick={closeModal}>
							<CloseRounded />
						</IconButton>
					</div>
					<KVPair _key="Дата" _value={date("date")} />
					<KVPair _key="Преподаватель" _value={student?.teacher} />
					<KVPair
						_key="Присутствие"
						_value={
							<StyledSwitch
								checked={date("class") === ""}
								onChange={setPresenceState}
							/>
						}
					/>
					{addEmptyButton()}
					{values()}
					{reason()}
				</div>
				<div className="modal-footer">
					<Button
						sx={{ color: "red" }}
						variant="text"
						onClick={clearValues}
					>
						Очистить
					</Button>
					<Button variant="text" onClick={saveStudent}>
						Сохранить
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ValueModal;
