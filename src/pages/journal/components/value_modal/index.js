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
import toggleTheme from "../../../../components/toggleTheme";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import KVPair from "../../../../components/kv_pair";

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
			let vals = student.days[props.day].values;
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
		let day = newStudent.days[props.day];
		day.class = e.target.checked ? "" : studentAbsent(newStudent);
		newStudent.days[props.day] = day;
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
		let newVals = newStudent.days[props.day].values;
		let currentVal = parseInt(e.target.dataset["value"]);
		let val = newVals[currentVal];
		val.value = newVal;
		newStudent.days[props.day].values = newVals;
		setStudent(newStudent);
	};

	const removeVal = (e) => {
		let newStudent = { ...student };
		let newVals = newStudent.days[props.day].values;
		let index = parseInt(e.target.dataset["value"]);
		newVals.splice(index, 1);
		newStudent.days[props.day].values = newVals;
		setStudent(newStudent);
	};

	const addValue = () => {
		let newStudent = { ...student };
		let newVal = {
			value: 5,
			type: "Тестирование",
		};
		if (newStudent.days[props.day].values.length <= 3) {
			newStudent.days[props.day].values.push(newVal);
			setStudent(newStudent);
		}
	};

	const date = (type) => {
		if (student) {
			if (student.days && props.day !== null) {
				if (type === "date") {
					let stringDate = dayjs(student.days[props.day].date);
					return stringDate.format("D MMMM YYYY г.");
				}

				if (type === "class") return student.days[props.day].class;

				if (type === "values") return student.days[props.day].values;
			}
		}

		return "";
	};

	const handleVlaueType = (newVal, event) => {
		let newStudent = { ...student };
		let valIndex = event.props["data-val"];
		newStudent.days[props.day].values[valIndex].type = newVal.target.value;
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
							value={value.type}
							sx={{ width: "100%" }}
						>
							<MenuItem data-val={index} value="Тестирование">
								Тестирование
							</MenuItem>
							<MenuItem
								data-val={index}
								value="Лабораторная работа"
							>
								Лабораторная работа
							</MenuItem>
							<MenuItem
								data-val={index}
								value="Контрольная работа"
							>
								Контрольная работа
							</MenuItem>
							<MenuItem
								data-val={index}
								value="Расчётно-графическая работа"
							>
								Расчётно-графическая работа
							</MenuItem>
							<MenuItem data-val={index} value="Домашняя работа">
								Домашняя работа
							</MenuItem>
							<MenuItem data-val={index} value="Другое">
								Другое
							</MenuItem>
						</Select>
					</div>
					<div className="value">
						<ThemeProvider theme={toggleTheme}>
							<ToggleButtonGroup
								sx={{ width: "100%" }}
								exclusive
								value={value.value}
								onChange={handleValue}
							>
								<ToggleButton
									size="small"
									value={5}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									5
								</ToggleButton>
								<ToggleButton
									size="small"
									value={4}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									4
								</ToggleButton>
								<ToggleButton
									size="small"
									value={3}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									3
								</ToggleButton>
								<ToggleButton
									size="small"
									value={2}
									data-value={index}
									sx={{ flexGrow: 1 }}
								>
									Неуд
								</ToggleButton>
							</ToggleButtonGroup>
						</ThemeProvider>
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
								student.days[props.day].values.length >= 3
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

	const studentAbsent = (s) => {
		let day = s.days[props.day];
		let absent_reason = day.absent_reason;
		let absent_doc = day.absent_doc;
		let absent_link = day.absent_link;

		if (
			(absent_reason === "" || absent_reason === null) &&
			(absent_doc === "" || absent_doc === null) &&
			(absent_link === "" || absent_link === null)
		) {
			return "absent";
		}

		return "soft-absent";
	};

	const handleFile = (e, newVal) => {
		const file = e.target.files[0];
		let newStudent = { ...student };
		let day = newStudent.days[props.day];
		day.class = studentAbsent(newStudent);
		day.absent_link = file ? file.name : "Выберите файл";
		newStudent.days[props.day] = day;
		setStudent(newStudent);
	};

	const clearFile = () => {
		let newStudent = { ...student };
		let day = newStudent.days[props.day];
		day.class = studentAbsent(newStudent);
		day.absent_link = "";
		newStudent.days[props.day] = day;

		setStudent(newStudent);
	};

	const inputLabel = () => {
		let clearFileClass =
			student.days[props.day].absent_link === null ||
			student.days[props.day].absent_link === ""
				? "clear-file hide"
				: "clear-file";
		return (
			<label htmlFor="reason_file" className="file-wrapper">
				<div className="file-label">
					<AttachmentRounded />
					<span>
						{student.days[props.day].absent_link || "Выберите файл"}
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
		let day = newStudent.days[props.day];
		day.absent_reason = e.target.value;
		day.class = studentAbsent(newStudent);
		newStudent.days[props.day] = day;
		setStudent(newStudent);
	};

	const docnameChange = (e) => {
		let newStudent = { ...student };
		let day = newStudent.days[props.day];
		day.absent_doc = e.target.value;
		day.class = studentAbsent(newStudent);
		newStudent.days[props.day] = day;
		setStudent(newStudent);
	};

	const clearValues = () => {
		let newStudent = { ...student };
		newStudent.days[props.day].values = [];
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
							value={student.days[props.day].absent_doc}
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
							value={student.days[props.day].absent_reason || ""}
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
						<div className="name">{student?.name}</div>
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
