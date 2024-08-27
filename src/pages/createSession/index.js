import React, { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import formatRange from "../../components/formatDate";
import { useParams } from "react-router-dom";
import {
	IconButton,
	Button,
	Card,
	CardContent,
	Grid,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { SaveRounded, PrintRounded, ClearRounded } from "@mui/icons-material";
import TimingModal from "./components/timing_modal";

function SessionEditor() {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [courseData, setCourseData] = useState({
		courseName: "",
		courseId: null,
		sessionId: null,
		checksStartDate: null,
		checksEndDate: null,
		examsStartDate: null,
		examsEndDate: null,
		holidaysStartDate: null,
		holidaysEndDate: null,
		disciplines: [],
	});

	const { course } = useParams();

	const reset = () => {};

	const save = () => {};

	const print = () => {
		window.print();
	};

	useEffect(() => {
		const courseId = parseInt(course);
		console.log(courseId);
		fetch("/data/createSession.json")
			.then((res) => res.json())
			.then((response) => {
				response.data.disciplines.forEach((d) => (d.mode = "view"));
				setCourseData(response.data);
			});
	}, [course]);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	const matches = useMediaQuery(theme.breakpoints.up("xl"));

	const handleChange = (e, child) => {
		const disciplineId = child.props["data-id"];
		const type = child.props["data-type"];
		const discipline = courseData.disciplines.find(
			(d) => d.disciplineId === disciplineId,
		);
		switch (type) {
			case "extra":
				discipline.controlType = e.target.value;
				break;
			default:
				discipline.extraControlType = e.target.value;
				break;
		}
		setCourseData({ ...courseData });
	};

	const controlEditor = (item, controlTypes, type) => {
		const cTypes = [
			"Экзамен",
			"Зачёт",
			"Дифф. зачёт",
			"Курсовая работа",
			"Курсовой проект",
		];

		if (item.mode === "view") {
			return (
				<span
					style={{
						display: "block",
						minWidth: "100px",
					}}
				>
					{
						cTypes[
							type === "main"
								? item.extraControlType
								: item.controlType
						]
					}
				</span>
			);
		} else {
			return (
				<Select
					size="small"
					variant="standard"
					onChange={handleChange}
					fullWidth
					sx={{ minWidth: "100px" }}
					value={
						type === "main"
							? item.extraControlType
							: item.controlType
					}
				>
					{cTypes.map((t, i) => {
						return (
							<MenuItem
								key={i}
								value={i}
								data-id={item.disciplineId}
								data-type={type}
							>
								{t}
							</MenuItem>
						);
					})}
				</Select>
			);
		}
	};

	const setEditMode = (e) => {
		const id = parseInt(e.currentTarget.dataset.id);
		const discipline = courseData.disciplines[id];
		discipline.mode = "edit";
		setCourseData({ ...courseData });
	};

	const unsetEditMode = () => {
		courseData.disciplines.forEach((d) => (d.mode = "view"));
		setCourseData({ ...courseData });
	};

	const tableBody = () => {
		return courseData.disciplines.map((d, index) => {
			return (
				<TableRow
					hover
					key={index}
					data-id={index}
					sx={{ height: "63px" }}
					onMouseEnter={setEditMode}
					onMouseLeave={unsetEditMode}
				>
					<TableCell>{d.disciplineName}</TableCell>
					<TableCell>???</TableCell>
					<TableCell>
						{controlEditor(
							d,
							["—", "Экзамен", "Зачёт", "Дифф. зачёт"],
							"main",
						)}
					</TableCell>
					<TableCell>
						{controlEditor(
							d,
							["—", "Курсовая работа", "Курсовой проект"],
							"extra",
						)}
					</TableCell>
				</TableRow>
			);
		});
	};

	const saveTiming = (course) => {
		setCourseData(course);
		setOpen(false);
	};

	const datesPreview = () => {
		const align = matches ? "right" : "left";
		return (
			<Grid container sx={{ marginBottom: "2vmax" }}>
				<Grid
					item
					xl={3}
					lg={6}
					md={12}
					sm={12}
					xs={12}
					sx={{ margin: "10px 0" }}
				>
					Зачётная неделя:{" "}
					<strong style={{ whiteSpace: "nowrap" }}>
						{formatRange(
							courseData.checksStartDate,
							courseData.checksEndDate,
						)}
					</strong>
				</Grid>
				<Grid
					item
					xl={3}
					lg={6}
					md={12}
					sm={12}
					xs={12}
					sx={{ margin: "10px 0" }}
				>
					Экзамены:{" "}
					<strong>
						{formatRange(
							courseData.examsStartDate,
							courseData.examsEndDate,
						)}
					</strong>
				</Grid>
				<Grid
					item
					xl={3}
					lg={6}
					md={12}
					sm={12}
					xs={12}
					sx={{ margin: "10px 0" }}
				>
					Каникулы:{" "}
					<strong>
						{formatRange(
							courseData.holidaysStartDate,
							courseData.holidaysEndDate,
						)}
					</strong>
				</Grid>
				<Grid
					item
					xl={3}
					lg={6}
					md={12}
					sm={12}
					xs={12}
					sx={{ textAlign: align, margin: "10px 0" }}
					className="screen"
				>
					<Button onClick={openModal} variant="contained">
						Изменить расписание
					</Button>
				</Grid>
			</Grid>
		);
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header={courseData.courseName}
						subheader="Добавление сессии"
						backLink={true}
					/>
					{datesPreview()}
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>Дисциплина</TableCell>
											<TableCell>Кафедра</TableCell>
											<TableCell sx={{ width: "260px" }}>
												Контроль
											</TableCell>
											<TableCell sx={{ width: "260px" }}>
												Дополнительный контроль
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{tableBody()}</TableBody>
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
							<Button variant="outlined" onClick={reset}>
								Сброс
							</Button>
							<Button variant="contained" onClick={save}>
								Сохранить
							</Button>
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
			<TimingModal
				isOpen={open}
				onClose={closeModal}
				courseData={courseData}
				onSave={saveTiming}
			/>
		</main>
	);
}

export default SessionEditor;
