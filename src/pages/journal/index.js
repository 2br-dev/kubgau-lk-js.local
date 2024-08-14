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
import React from "react";
import studentAbsent from "./components/student_absent";

Journal.propTypes = {};

/**
 * Журнал посещаемости
 * @returns
 */
function Journal() {
	// Инициализация
	let my_table = useRef(null);
	const [students, setStudents] = useState([
		{
			id: null,
			lastName: "",
			firstName: "",
			middleName: "",
			certificatesOfSkipping: [],
			lessons: [
				{
					lessonId: null,
					lessonDate: null,
					grades: [],
				},
			],
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
		fetch("/data/getJournalData.json")
			.then((res) => res.json())
			.then((data) => {
				setStudents(data.students);
			});
	}, []);

	// Сохранение студента
	const updateStudent = (newStudent) => {
		setIsStudentOpen(false);
		setStudent(student);
		let newStudents = [...students];
		newStudents = newStudents.map((s) => {
			if (s.studentId === student.studentId) return newStudent;
			else return s;
		});
		setStudents(newStudents);
	};

	// Открытие студента
	const openStudent = (e) => {
		let studentId = parseInt(e.currentTarget.dataset["student"]);
		let dayId = parseInt(e.currentTarget.dataset["day"]);

		let student = students.filter((s) => {
			return s.studentId === studentId;
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

	// Открытие урока
	const openEvent = (e) => {
		let el = e.target;
		let day = parseInt(el.dataset["day"]);
		let month = parseInt(el.dataset["group"]);
		let theme = el.dataset["theme"];
		const pairNum = el.dataset["pair"];
		setEvent({
			date: day,
			month: month,
			theme: theme,
			pairNum: pairNum,
		});

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
	const saveEvent = () => {
		setEventOpen(false);
	};

	// Подсветка строки
	const highlight = (e) => {
		e.target.classList.add("extra-highlight");
		let row = e.target.parentElement;
		let table = row.parentElement.parentElement;

		if (!row || !table) return;

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
	const resetHighlight = () => {
		my_table.current.querySelectorAll("td").forEach((cell) => {
			cell.classList?.remove("highlight");
			cell.classList?.remove("extra-highlight");
		});
	};

	// Отображение тултипов
	const handleCheck = (e) => {
		setTooltips(e.target.checked);
	};

	// Оценки
	const grades = (grades) => {
		const types = [
			"Тестирование",
			"Лабораторная работа",
			"Контрольная работа",
			"Расчётно-графическая работа",
			"Доашняя работа",
			"Другое",
		];
		if (grades.length > 0) {
			return grades.map((g, index) => (
				<Fragment key={index}>
					<Tooltip
						title={tooltips ? types[g.gradeType] : ""}
						placement="top"
					>
						<span>{g.grade}</span>
					</Tooltip>
					{index < grades.length - 1 ? " / " : ""}
				</Fragment>
			));
		} else {
			return <>–</>;
		}
	};

	// Заголовок
	const header = () => {
		const lessons = students[0].lessons;
		const dates =
			lessons.length > 0
				? lessons.map((l) => new Date(l.lessonDate).getMonth())
				: [];

		let monthesNum = [...new Set(dates)];
		let counts = monthesNum.map((m) => {
			return dates.filter((d) => {
				return d === m;
			}).length;
		});

		const monthesVals = [
			"Январь",
			"Февраль",
			"Март",
			"Апрель",
			"Май",
			"Июнь",
			"Июль",
			"Август",
			"Сентябрь",
			"Октябрь",
			"Ноябрь",
			"Декабрь",
		];
		let monthes = monthesNum.map((m) => {
			return monthesVals[m];
		});

		return (
			<>
				<colgroup>
					<col className="num" />
					<col className="num" />
				</colgroup>
				{counts.map((count, index) => (
					<colgroup key={index}>
						<col className="month" span={count} />
					</colgroup>
				))}
				<colgroup>
					<col className="num" />
					<col className="num" />
				</colgroup>
				<thead>
					<tr>
						<th rowSpan={2}>Номер</th>
						<th rowSpan={2}>ФИО</th>
						{monthes.map((m, index) => {
							return (
								<th key={index} colSpan={counts[index]}>
									{m}
								</th>
							);
						})}
						<th rowSpan={2}>Ср. балл</th>
						<th rowSpan={2}>Ср. общ. балл</th>
					</tr>
					<tr>
						{lessons.map((lesson, index) => {
							let day = new Date(lesson.lessonDate);

							let lessonMonth = day.getMonth();
							let lessonDay = day.getDate();
							return (
								<th
									data-date={lesson.lessonDate}
									data-month={lessonMonth}
									key={index}
									data-theme={lesson.theme}
									onClick={openEvent}
								>
									{lessonDay}
								</th>
							);
						})}
					</tr>
				</thead>
			</>
		);
	};

	// Подвал
	const footer = () => (
		<tfoot>
			<tr>
				<th></th>
				<th>Посещаемость, %</th>
				{students[0].lessons.map((student, index) => {
					return (
						<th key={index}>
							<Tooltip
								title="Нужны данные в JSON"
								placement="top"
							>
								<span>96</span>
							</Tooltip>
						</th>
					);
				})}
				<th colSpan={2}></th>
			</tr>
		</tfoot>
	);

	const dateCell = (lesson, index, student) => {
		// Проверяем пропуск
		let className = studentAbsent(student, index);

		return (
			<td
				className={className}
				onMouseOver={highlight}
				onMouseLeave={resetHighlight}
				key={index}
				data-student={student.studentId}
				data-day={index}
				onClick={openStudent}
			>
				{grades(lesson.grades)}
			</td>
		);
	};

	// Таблица с оценками
	const table = () => {
		return students.map((student, index) => (
			<tr key={index}>
				<th>{index + 1}</th>
				<th>
					{student.lastName} {student.firstName} {student.middleName}
				</th>
				{student.lessons.map((lesson, lessonIndex) =>
					dateCell(lesson, lessonIndex, student)
				)}
				<th style={{ minWidth: "45px" }}>
					<Tooltip title="Нужны значения в JSON" placement="top">
						<span>4</span>
					</Tooltip>
				</th>
				<th style={{ minWidth: "50px" }}>
					<Tooltip title="Нужны значения в JSON" placement="top">
						<span>4</span>
					</Tooltip>
				</th>
			</tr>
		));
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
									{header()}
									<tbody>{table()}</tbody>
									{footer()}
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
