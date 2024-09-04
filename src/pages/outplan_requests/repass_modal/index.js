/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
	Autocomplete,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	TextField,
	Button,
} from "@mui/material";
import { AddRounded, CloseRounded } from "@mui/icons-material";
import { useState, useEffect } from "react";
import StudentsTable from "./students_table";
import StatementsTable from "./statements_table";
import StatementModal from "../statement_modal";

RepassModal.props = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
};

function RepassModal(props) {
	const [request, setRequest] = useState({
		group: null,
		students: [],
		orderNumber: "",
		individualSchedule: false,
		badGradesRetake: false,
		approveStatus: 0,
		outsidePlanPassingId: 0,
	});

	const [availableGroups, setAvailableGroups] = useState([]);
	const [availableStudents, setAvailableStudents] = useState([]);
	const [student2add, setStudent2add] = useState(null);
	const [step, setStep] = useState(0);
	const [open2, setOpen2] = useState(false);

	const handleAddStatement = () => {
		setOpen2(true);
	};

	useEffect(() => {
		setStep(0);
		setRequest({
			group: null,
			students: [],
			orderNumber: "",
			individualSchedule: false,
			badGradesRetake: false,
			approveStatus: 0,
			outsidePlanPassingId: 0,
		});

		// Подгружаем список доступных групп
		fetch("/data/availableGroups.json")
			.then((res) => res.json())
			.then((response) => setAvailableGroups(response.data));

		// Подгружаем список доступных студентов
		fetch("/data/available_students.json")
			.then((res) => res.json())
			.then((response) => setAvailableStudents(response.data));
	}, [props]);

	const handleNumberChange = (e) => {
		request.orderNumber = e.target.value;
		setRequest({ ...request });
	};

	const className =
		props.open === true ? "modal-wrapper open" : "modal-wrapper";

	const handleIndividualChange = (e) => {
		request.individualSchedule = e.target.checked;
		setRequest({ ...request });
	};

	const handleBadRetake = (e) => {
		request.badGradesRetake = e.target.checked;
		setRequest({ ...request });
	};

	const handleGroupChange = (e) => {
		request.group = e.target.value;
		setRequest({ ...request });
	};

	const handleStudentSelect = (e, newVal) => {
		setStudent2add(newVal);
	};

	const shortName = (student) => {
		if (!student) return "";
		let arr = student.split(" ");
		return arr[0] + " " + arr[1].charAt(0) + ". " + arr[2].charAt(0) + ".";
	};

	const handleAddStudent = () => {
		if (student2add) {
			request.students.push({
				key: student2add.studentId,
				value: student2add.fullName,
			});
			setRequest({ ...request });

			setStudent2add(null);
		}
	};

	const handleDeleteStudent = (studentId) => {
		request.students = request.students.filter(
			(student) => student.key !== studentId,
		);
		setRequest({ ...request });
	};

	const backButton = () => {
		if (step === 1) {
			return (
				<Button variant="text" onClick={prevStep}>
					Назад
				</Button>
			);
		} else {
			return <span></span>;
		}
	};

	const handleSubmit = () => {
		let output = {
			orderNumber: request.orderNumber,
			isIndividualSchedule: request.individualSchedule,
			isBadGradesRetake: request.badGradesRetake,
			groupId: request.group,
		};
		props.onSubmit(output);
	};

	const forwardButton = () => {
		if (step === 0) {
			return (
				<Button varian="text" onClick={nextStep}>
					Далее
				</Button>
			);
		} else {
			return (
				<Button variant="text" onClick={handleSubmit}>
					Сохранить
				</Button>
			);
		}
	};

	const nextStep = () => {
		setStep(step + 1);
	};

	const prevStep = () => {
		setStep(step - 1);
	};

	const getStatements = (statements) => {
		console.log(statements);
	};

	const saveStatement = (statement) => {
		console.log(statement);
	};

	const step1Data = () => {
		if (step === 0) {
			return (
				<>
					<Grid item md={5}>
						<Autocomplete
							options={availableGroups}
							fullWidth
							onChange={handleGroupChange}
							ListboxProps={{
								style: {
									maxHeight: 300,
								},
							}}
							getOptionLabel={(item) => item.value}
							renderInput={(params) => (
								<TextField
									fullWidth
									variant="standard"
									{...params}
									label="Группа"
								/>
							)}
						/>
					</Grid>
					<Grid item md={7}>
						<div
							style={{
								display: "flex",
								alignItems: "flex-end",
							}}
						>
							<Autocomplete
								options={availableStudents}
								fullWidth
								value={student2add}
								onChange={handleStudentSelect}
								ListboxProps={{
									style: {
										maxHeight: 300,
									},
								}}
								getOptionLabel={(item) =>
									shortName(item.fullName)
								}
								renderInput={(params) => (
									<TextField
										fullWidth
										variant="standard"
										{...params}
										label="ФИО студента"
									/>
								)}
							/>
							<IconButton onClick={handleAddStudent}>
								<AddRounded />
							</IconButton>
						</div>
					</Grid>
					<Grid item sm={12}>
						<StudentsTable
							onDelete={handleDeleteStudent}
							students={request.students}
						/>
					</Grid>
				</>
			);
		}
	};

	const step2Data = () => {
		if (step === 1) {
			return (
				<StatementsTable
					onAddStatement={handleAddStatement}
					onLoad={getStatements}
				/>
			);
		}
	};
	const handleModal2Close = () => {
		setOpen2(false);
	};

	return (
		<>
			<div className={className}>
				<div className="modal" style={{ maxWidth: "900px" }}>
					<div className="modal-header">
						<div className="name">
							Заявка на внеплановую сдачу сессии
						</div>
						<IconButton onClick={props.onClose}>
							<CloseRounded />
						</IconButton>
					</div>
					<div className="modal-content">
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									value={request.orderNumber}
									onChange={handleNumberChange}
									label="Номер распоряжения"
									variant="standard"
									fullWidth
								/>
							</Grid>
							<Grid item md={6}>
								<FormControlLabel
									sx={{ userSelect: "none" }}
									control={
										<Checkbox
											checked={request.individualSchedule}
											onChange={handleIndividualChange}
										/>
									}
									label="Индивидуальный график"
								/>
							</Grid>
							<Grid item md={6}>
								<FormControlLabel
									sx={{ userSelect: "none" }}
									control={
										<Checkbox
											checked={request.badGradesRetake}
											onChange={handleBadRetake}
										/>
									}
									label="Пересдача оценок «3» и «4»"
								/>
							</Grid>
							{step1Data()}
							{step2Data()}
						</Grid>
					</div>
					<div className="modal-footer">
						{backButton()}
						{forwardButton()}
					</div>
				</div>
			</div>
			<StatementModal
				isOpen={open2}
				onSubmit={saveStatement}
				onClose={handleModal2Close}
			/>
		</>
	);
}

export default RepassModal;
