import React, { useEffect } from "react";
import PageHeader from "../../components/pageHeader";
import { useState } from "react";
import {
	Card,
	CardContent,
	Grid,
	Table,
	TableCell,
	TableHead,
	TableRow,
	TableBody,
	TableContainer,
	Button,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import KVPair from "../../components/kv_pair";
import { Link } from "react-router-dom";
import {
	ClearRounded,
	DeleteRounded,
	PrintRounded,
	SaveRounded,
} from "@mui/icons-material";
import { ThemeProvider } from "@emotion/react";
import { toggleTheme } from "../../components/toggleTheme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function PracticeDetails() {
	const [data, setData] = useState({});
	const [mode, setMode] = useState("view");

	const types = ["Основная", "Дополнительная", "Комиссионная", "Внеплановая"];

	useEffect(() => {
		fetch("/data/practiceDetails.json")
			.then((response) => response.json())
			.then((response) => {
				setData(response.statement);
			})
			.catch((error) => console.error("Error:", error));
	}, []);

	const print = () => {
		window.print();
	};

	const dateSetter = (newVal) => {
		let newData = { ...data };
		newData.creationDate = newVal.toDate().toString();
		setData(newData);
	};

	const calendarEditor = (value) => {
		if (mode === "view") {
			return formatDate(value);
		} else {
			const date = dayjs(value);
			return (
				<LocalizationProvider
					dateAdapter={AdapterDayjs}
					adapterLocale="ru"
				>
					<DatePicker
						sx={{ width: "100%" }}
						value={date}
						onChange={dateSetter}
						slotProps={{
							textField: {
								variant: "standard",
								"data-name": "name",
							},
						}}
					/>
				</LocalizationProvider>
			);
		}
	};

	const reset = () => {
		fetch("/data/practiceDetails.json")
			.then((response) => response.json())
			.then((response) => {
				setData(response.statement);
			})
			.catch((error) => console.error("Error:", error));
	};

	const save = () => {
		if (mode === "view") {
			setMode("edit");
		} else {
			setMode("view");
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleString("ru-RU", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const link = (linkText, url) => {
		if (url !== null) {
			return <Link to={url}>{linkText}</Link>;
		}
		return <></>;
	};

	const getValue = (value, index) => {
		if (mode === "view") {
			switch (value) {
				case 1:
					return "";
				case 6:
					return "Не допущен";
				case 7:
					return "Неявка";
				default:
					return value;
			}
		} else {
			return (
				<ThemeProvider theme={toggleTheme}>
					<ToggleButtonGroup
						className="screen"
						exclusive
						value={value}
						onChange={setValue}
					>
						<ToggleButton data-student={index} value={5}>
							5
						</ToggleButton>
						<ToggleButton data-student={index} value={4}>
							4
						</ToggleButton>
						<ToggleButton data-student={index} value={3}>
							3
						</ToggleButton>
						<ToggleButton data-student={index} value={2}>
							2
						</ToggleButton>
						<ToggleButton data-student={index} value={7}>
							Неявка
						</ToggleButton>
						<ToggleButton data-student={index} value={6}>
							Недопуск
						</ToggleButton>
					</ToggleButtonGroup>
				</ThemeProvider>
			);
		}
	};

	const deleteStudent = (e) => {
		const newData = { ...data };
		const dataHolder = parents(e.target);
		const index = parseInt(dataHolder.dataset.student);
		newData.students.splice(index, 1);
		setData(newData);
	};

	const parents = (el) => {
		if (el.tagName === "TR") {
			return el;
		}
		return parents(el.parentElement);
	};

	const setValue = (e, newVal) => {
		const dataHolder = parents(e.target);
		const index = dataHolder.dataset.student;
		const newData = { ...data };
		const student = newData.students[parseInt(index)];
		student.grade = newVal;
		setData(newData);
	};

	const docCells = (s) => {
		if (mode === "view") {
			return (
				<>
					<TableCell sx={{ width: "15%" }} className="screen">
						{link("Скачать", s.attestationListUrl)}
					</TableCell>
					<TableCell sx={{ width: "15%" }} className="screen">
						{link("Скачать", s.reportUrl)}
					</TableCell>
					<TableCell sx={{ width: "15%" }} className="screen">
						{link("Скачать", s.documentsUrl)}
					</TableCell>
				</>
			);
		}
		return (
			<TableCell sx={{ textAlign: "right" }} className="screen">
				<IconButton onClick={deleteStudent}>
					<DeleteRounded />
				</IconButton>
			</TableCell>
		);
	};

	const tableContent = () => {
		if (data.students) {
			return data.students.map((s, index) => (
				<TableRow hover key={index} data-student={index}>
					<TableCell>{index + 1}</TableCell>
					<TableCell>
						{s.lastName} {s.firstName} {s.lastName}
					</TableCell>
					<TableCell>{getValue(s.grade)}</TableCell>
					{docCells(s, index)}
				</TableRow>
			));
		}
		return (
			<TableRow hover key={0}>
				<TableCell colSpan={6} sx={{ textAlign: "center" }}>
					Нет данных
				</TableCell>
			</TableRow>
		);
	};

	const docsHeader = () => {
		if (mode === "view") {
			return (
				<>
					<TableCell className="screen">
						Аттестационный лист
					</TableCell>
					<TableCell className="screen">Отчёт</TableCell>
					<TableCell className="screen">Документы</TableCell>
				</>
			);
		}
		return <TableCell sx={{ textAlign: "right" }}>Удалить</TableCell>;
	};

	return (
		<>
			<main>
				<section>
					<div className="container">
						<PageHeader
							header={`Ведомость №${data.statementNumber}`}
							subheader={data.practiceType}
							backLink={true}
						/>
						<Grid sx={{ marginBottom: "2vmax" }} container>
							<Grid item lg={3} md={6} sm={12} xs={12}>
								<KVPair
									_key="Статус"
									_value={
										data.closingDate === null
											? "Открыта"
											: "Закрыта"
									}
								/>
								<KVPair
									_key="Дата закрытия"
									_value={data.closingDate}
								/>
							</Grid>
							<Grid item lg={3} md={6} sm={12} xs={12}>
								<KVPair _key="Группа" _value={data.groupName} />
							</Grid>
							<Grid item lg={3} md={6} sm={12} xs={12}>
								<KVPair
									_key="Дата открытия"
									_value={calendarEditor(data.creationDate)}
								/>
							</Grid>
							<Grid item lg={3} md={6} sm={12} xs={12}>
								<KVPair
									_key="Тип ведомости"
									_value={types[data.passingType]}
								/>
							</Grid>
						</Grid>
						<Card>
							<CardContent>
								<TableContainer>
									<Table className="simple-table">
										<TableHead>
											<TableRow>
												<TableCell>№</TableCell>
												<TableCell>
													ФИО студента
												</TableCell>
												<TableCell>Оценка</TableCell>
												{docsHeader()}
											</TableRow>
										</TableHead>
										<TableBody>{tableContent()}</TableBody>
									</Table>
								</TableContainer>
							</CardContent>
						</Card>
						<div className="card-actions-wrapper screen desktop">
							<div className="left-side">
								<Button onClick={print} variant="outlined">
									Печать
								</Button>
							</div>
							<div className="right-side">
								<Button
									variant="outlined"
									onClick={reset}
									sx={{
										display:
											mode === "edit"
												? "initial"
												: "none",
									}}
								>
									Сброс
								</Button>
								<Button variant="contained" onClick={save}>
									{mode === "edit"
										? "Сохранить"
										: "Редактировать"}
								</Button>
							</div>
						</div>
						<div className="card-actions-wrapper mobile">
							<IconButton onClick={print}>
								<PrintRounded />
							</IconButton>
							<IconButton
								onClick={reset}
								sx={{
									display:
										mode === "edit" ? "initial" : "none",
								}}
							>
								<ClearRounded />
							</IconButton>
							<IconButton onClick={save}>
								<SaveRounded />
							</IconButton>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

export default PracticeDetails;
