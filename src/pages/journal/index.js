import { Fragment, useEffect, useRef } from "react";
import { useState } from "react";
import "./index.scss";
import {
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Tooltip,
} from "@mui/material";
import ValueModal from "./components/value_modal";
import DateModal from "./components/date_modal";
import PageHeader from "../../components/pageHeader";

/**
 * Журнал посещаемости
 * @returns
 */
function Journal() {
	// Инициализация
	let my_table = useRef(null);
	const [headerData, setHeaderData] = useState([
		{
			group: [
				{
					title: "",
					content: [],
				},
			],
		},
	]);
	const [footerData, setFooterData] = useState([]);
	const [students, setStudents] = useState([
		{
			id: null,
			name: "",
			days: [],
		},
	]);
	const [tooltips, setTooltips] = useState(true);
	const [isStudentOpen, setIsStudentOpen] = useState(false);
	const [day, setDay] = useState(null);
	const [student, setStudent] = useState(null);
	const [event, setEvent] = useState({
		pair: 1,
		groupId: null,
		dayId: null,
		date: null,
		theme: "",
	});
	const [eventOpen, setEventOpen] = useState(false);

	// Получение данных
	useEffect(() => {
		fetch("/data/student_values.json")
			.then((res) => res.json())
			.then((data) => {
				setHeaderData(data.header);
				setFooterData(data.footer);
				setStudents(data.students);
			});
	}, []);

	// Сохранение студента
	const updateStudent = (newStudent) => {
		setIsStudentOpen(false);
		setStudent(student);
		let newStudents = [...students];
		newStudents = newStudents.map((s) => {
			if (s.id === student.id) return newStudent;
			else return s;
		});
		setStudents(newStudents);
	};

	// Открытие студента
	const openStudent = (e) => {
		let studentId = parseInt(e.currentTarget.dataset["student"]);
		let dayId = parseInt(e.currentTarget.dataset["day"]);

		let student = students.filter((s) => {
			return s.id === studentId;
		})[0];

		setStudent(student);
		setDay(dayId);
		setTimeout(() => {
			setIsStudentOpen(true);
		});
	};

	// Закрытие студента
	const closeStudent = (defaultStudent) => {
		setIsStudentOpen(false);
		setStudent(defaultStudent);
	};

	// Получение оценок
	const getValues = (day, index) => {
		if (day.values.length === 0) {
			return (
				<span key={index} className="fogged">
					–
				</span>
			);
		} else {
			return (
				<span key={index}>
					{day.values.map((value, index2) => {
						return (
							<Fragment key={index2}>
								<Tooltip
									title={tooltips ? value.type : ""}
									placement="top"
								>
									<span>{value.value}</span>
								</Tooltip>
								{index2 < day.values.length - 1 ? " / " : ""}
							</Fragment>
						);
					})}
				</span>
			);
		}
	};

	// Открытие урока
	const openEvent = (e) => {
		let el = e.target;
		let day = parseInt(el.dataset["day"]);
		let month = parseInt(el.dataset["group"]);
		let lessonData = headerData[month].group[0].content[day];
		lessonData.dayId = day;
		lessonData.groupId = month;
		setEvent(lessonData);

		setTimeout(() => {
			setEventOpen(true);
		});
	};

	// Закрытие урока
	const closeEvent = (defaultEvent) => {
		setEvent(defaultEvent);
		setEventOpen(false);
	};

	// Сохранение урока
	const saveEvent = (event) => {
		let day = event.date.$D;
		let month = [
			"jan",
			"feb",
			"mar",
			"apr",
			"may",
			"jun",
			"july",
			"aug",
			"sept",
			"oct",
			"nov",
			"dec",
		][event.date.$M];
		let year = event.date.$y;

		let newHeaderData = [...headerData];
		let group = newHeaderData[event.groupId];
		let dayEntry = group.group[0].content[event.dayId];
		dayEntry.day = day;
		dayEntry.date = day + ` ${month} ` + year;
		dayEntry.pair = parseInt(event.pair);

		setHeaderData(headerData);
		setEventOpen(false);
	};

	// Подсветка строки
	const highlight = (e) => {
		e.target.classList.add("extra-highlight");
		let row = e.target.parentElement;
		let table = row.parentElement.parentElement;
		let rowIndex = e.target.cellIndex;

		// Row
		row.querySelectorAll("td").forEach((cell) => {
			cell.classList.add("highlight");
		});

		// Column
		table.querySelectorAll("tbody tr").forEach((row) => {
			let col = row.querySelectorAll("td")[rowIndex - 2];
			col?.classList.add("highlight");
		});
	};

	// Сброс подсветки строки
	const resetHighlight = (e) => {
		my_table.current.querySelectorAll("td").forEach((cell) => {
			cell.classList?.remove("highlight");
			cell.classList?.remove("extra-highlight");
		});
	};

	// Отображение тултипов
	const handleCheck = (e) => {
		setTooltips(e.target.checked);
	};

	// DOM
	return (
		<main id="journal">
			<section>
				<div className="container">
					<PageHeader
						header="Программирование"
						subheader="Журнал посещаемости"
						backLink={true}
					/>
					<Card>
						<CardContent>
							<div className="card-header">
								<div className="title">
									<h2>БИ2001 - подгруппа 1 (96%)</h2>
								</div>
								<div className="extra">
									<FormControlLabel
										control={
											<Checkbox
												checked={tooltips}
												onClick={handleCheck}
											/>
										}
										label="Подсказки"
									/>
								</div>
							</div>
							<div className="table-wrapper">
								<table className="complex-table" ref={my_table}>
									{headerData.map((col, index) => {
										return (
											<colgroup key={index}>
												{col.group.map(
													(item, index) => {
														let className =
															item.content ===
															null
																? "num"
																: "month";
														return (
															<col
																key={index}
																className={
																	className
																}
																span={
																	item.content
																		.length
																}
															/>
														);
													}
												)}
											</colgroup>
										);
									})}
									<thead>
										<tr>
											{headerData.map((col, index) => {
												return col.group.map(
													(group, index2) => {
														if (
															group.content
																.length === 0
														) {
															return (
																<th
																	key={index2}
																	rowSpan={2}
																>
																	{
																		group.title
																	}
																</th>
															);
														} else {
															return (
																<th
																	key={index2}
																	colSpan={
																		group
																			.content
																			.length
																	}
																>
																	{
																		group.title
																	}
																</th>
															);
														}
													}
												);
											})}
										</tr>
										<tr>
											{headerData.map((col, index) => {
												return col.group.map(
													(group, index2) => {
														return group.content.map(
															(cell, index3) => {
																return (
																	<th
																		onClick={
																			openEvent
																		}
																		data-group={
																			index
																		}
																		data-day={
																			index3
																		}
																		key={
																			index3
																		}
																	>
																		{
																			cell.day
																		}
																	</th>
																);
															}
														);
													}
												);
											})}
										</tr>
									</thead>
									<tbody>
										{students.map((student, index) => {
											return (
												<tr key={index}>
													<th>{student.id}</th>
													<th>{student.name}</th>
													{student.days.map(
														(day, index2) => {
															return (
																<td
																	data-student={
																		student.id
																	}
																	key={index2}
																	data-day={
																		index2
																	}
																	className={
																		day.class
																	}
																	onMouseEnter={
																		highlight
																	}
																	onMouseLeave={
																		resetHighlight
																	}
																	onClick={
																		openStudent
																	}
																>
																	{getValues(
																		day,
																		index2
																	)}
																</td>
															);
														}
													)}
													<th className="summary">
														{student.middle_value}
													</th>
													<th className="summary">
														{
															student.middle_common_value
														}
													</th>
												</tr>
											);
										})}
									</tbody>
									<tfoot>
										<tr>
											{footerData.map((entry, index) => {
												return (
													<th
														key={index}
														colSpan={entry.span}
													>
														<span>
															{entry.content}
														</span>
													</th>
												);
											})}
											<th colSpan={2}></th>
										</tr>
									</tfoot>
								</table>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
			<ValueModal
				day={day}
				student={student}
				open={isStudentOpen}
				saveHandler={updateStudent}
				closeHandler={closeStudent}
			/>
			<DateModal
				event={event}
				open={eventOpen}
				saveHandler={saveEvent}
				closeHandler={closeEvent}
			/>
		</main>
	);
}

export default Journal;
