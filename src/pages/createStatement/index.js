import React, { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Switch,
	Button,
	IconButton,
	FormControlLabel,
	Radio,
	RadioGroup,
	Link,
	ToggleButtonGroup,
	ToggleButton,
	Grid,
	ButtonGroup,
	TextField,
} from "@mui/material";
import { PrintRounded, ClearRounded, SaveRounded } from "@mui/icons-material";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import toggleTheme from "../../components/toggleTheme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

function CreateStatement() {
	const [statement, setStatement] = useState({
		sessionId: 0,
		groupName: "Название группы",
		disciplineName: "Название дисциплины",
		statementNumber: "",
		deadline: null,
		employees: [],
		students: [],
		controlTypeId: null,
	});

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
		"& .Mui-disabled": {
			filter: "grayscale(1)",
		},
		"& .Mui-disabled + .MuiSwitch-track": {
			filter: "grayscale(1)",
		},
	}));

	const handleDateChange = (newVal) => {
		statement.deadline = newVal;
		setStatement({ ...statement });
	};

	const typeName = () => {
		switch (statement.controlTypeId) {
			case 0:
				return " экзаменационной ";
			case 1:
				return " зачётной ";
			case 2:
				return " зачётной ";
			case 3:
				return " курсовой ";
			case 4:
				return " курсовой ";
			default:
				return " ";
		}
	};

	const addGrade = (statement) => {
		statement.students.forEach((s) => {
			if (s.documents.length) {
				s.gradeId = 1;
			}
		});
		return statement;
	};

	useEffect(() => {
		fetch("/data/createStatement.json")
			.then((res) => res.json())
			.then((response) => setStatement(addGrade(response.data)));
	}, []);

	const setAccess = (e) => {
		const studentId = parseInt(e.target.dataset.id);
		let student = statement.students.filter(
			(s) => s.studentId === studentId,
		)[0];
		if (student) {
			student.notAllowed = !e.target.checked;
		}
		setStatement({ ...statement });
	};

	const partName = (fullName, part) => {
		return fullName.split(" ")[part];
	};

	const repassReason = (student) => {
		if (student.documents.length) {
			const radioName = `reason${student.studentId}`;
			return (
				<RadioGroup
					name={radioName}
					defaultValue={student.documents[0].documentNumber}
				>
					{student.documents.map((d, dindex) => {
						const formatDate = (date) => {
							return new Date(date).toLocaleString("ru", {
								day: "numeric",
								month: "long",
								year: "numeric",
							});
						};

						const reason = `№${d.documentNumber} от ${formatDate(d.documentDate)}`;
						const file = `https://fs.kubsau.ru/File/${d.registryDocumentGuid}`;

						return (
							<FormControlLabel
								key={dindex}
								control={<Radio value={d.documentNumber} />}
								label={
									<span style={{ whiteSpace: "nowrap" }}>
										<span>документ </span>
										<Link href={file}>{reason}</Link>
									</span>
								}
							/>
						);
					})}
				</RadioGroup>
			);
		} else {
			return "—";
		}
	};

	const setGrade = (e, newVal) => {
		if (newVal === null) newVal = 1;
		const studentId = parseInt(e.target.dataset.id);
		let student = statement.students.filter(
			(s) => s.studentId === studentId,
		);
		student = student[0];
		student.grade = newVal;
		setStatement({ ...statement });
	};

	const repassControl = (student) => {
		if (student.documents.length) {
			switch (statement.controlTypeId) {
				case 1:
					return (
						<ThemeProvider theme={toggleTheme}>
							<ToggleButtonGroup
								exclusive
								value={student.grade}
								onChange={setGrade}
							>
								<ToggleButton
									data-id={student.studentId}
									value={5}
								>
									Зачёт
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={2}
								>
									Незачёт
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={7}
								>
									Неявка
								</ToggleButton>
							</ToggleButtonGroup>
						</ThemeProvider>
					);
				default:
					return (
						<ThemeProvider theme={toggleTheme}>
							<ToggleButtonGroup
								exclusive
								value={student.grade}
								onChange={setGrade}
							>
								<ToggleButton
									data-id={student.studentId}
									value={5}
								>
									5
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={4}
								>
									4
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={3}
								>
									3
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={2}
								>
									Неуд
								</ToggleButton>
								<ToggleButton
									data-id={student.studentId}
									value={7}
								>
									Неявка
								</ToggleButton>
							</ToggleButtonGroup>
						</ThemeProvider>
					);
			}
		} else {
			return "—";
		}
	};

	const tableBody = () => {
		return statement.students.map((s, sindex) => {
			return (
				<TableRow key={sindex}>
					<TableCell>
						<strong>{partName(s.fullName, 0)}</strong>
					</TableCell>
					<TableCell>{partName(s.fullName, 1)}</TableCell>
					<TableCell>{partName(s.fullName, 2)}</TableCell>
					<TableCell>{repassControl(s)}</TableCell>
					<TableCell>{repassReason(s)}</TableCell>
					<TableCell>
						<StyledSwitch
							onChange={setAccess}
							disabled={statement.controlTypeId !== 0}
							inputProps={{
								"data-id": s.studentId,
							}}
							checked={
								statement.controlTypeId === 0
									? !s.notAllowed
									: true
							}
						/>
					</TableCell>
				</TableRow>
			);
		});
	};

	const save = () => {};

	const reset = () => {};

	const print = () => {};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						backLink={true}
						header={statement.disciplineName}
						subheader={`Создание${typeName()}ведомости`}
					/>
					<Grid container sx={{ marginBottom: "2vmax" }} spacing={2}>
						<Grid
							item
							xl={2}
							lg={3}
							md={6}
							sm={12}
							xs={12}
							spacing={2}
						>
							<TextField
								label="Номер ведомости"
								variant="standard"
								fullWidth
							/>
						</Grid>
						<Grid item xl={2} lg={3} md={6} xs={12}>
							<LocalizationProvider
								dateAdapter={AdapterDayjs}
								adapterLocale="ru"
							>
								<DatePicker
									size="small"
									fullWidth
									value={statement.deadline}
									onChange={handleDateChange}
									label="Дата/время"
									variant="standard"
									slotProps={{
										textField: {
											variant: "standard",
											fullWidth: true,
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item lg={4} xs={12}>
							<TextField
								label="Преподаватели"
								variant="standard"
								fullWidth
							/>
						</Grid>
					</Grid>
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>Фамилия</TableCell>
											<TableCell>Имя</TableCell>
											<TableCell>Отчество</TableCell>
											<TableCell>Пересдача</TableCell>
											<TableCell>Основание</TableCell>
											<TableCell>Допуск</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{tableBody()}</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
					<div className="card-actions-wrapper screen desktop">
						<div className="left-side"></div>
						<div className="right-side">
							<ButtonGroup>
								<Button variant="outlined" onClick={reset}>
									Сброс
								</Button>
								<Button
									variant="contained"
									onClick={save}
									disableElevation
								>
									Выписать ведомость
								</Button>
							</ButtonGroup>
						</div>
					</div>
					<div className="card-actions-wrapper mobile desktop">
						<IconButton onClick={print}>
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
	);
}

export default CreateStatement;
