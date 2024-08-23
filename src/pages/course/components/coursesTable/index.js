import {
	Button,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	TableContainer,
} from "@mui/material";
import CollapsibleRow from "../collapsibleRow";
import FilterCourses from "../filter_courses";
import React from "react";
import EditModal from "../editModal";

import { useState, useEffect } from "react";

function CoursesTable() {
	const [courses, setCourses] = useState([]);
	const [rowStates, setRowStates] = useState([]);
	const [disciplines, setDisciplines] = useState([]);
	const [coursesList, setCoursesList] = useState([]);
	const [globalCollapse, setGlobalCollapse] = useState(true);
	const [editOpen, setEditOpen] = useState(false);
	const [course2edit, setCourse2edit] = useState(null);

	/**
	 * Переключение открытости всех строк
	 */
	const toggleCollapse = () => {
		setGlobalCollapse(!globalCollapse);

		let states = [...rowStates];
		states.forEach((c) => {
			c.is_open = globalCollapse;
		});

		setRowStates(states);
	};

	/**
	 * Переключение открытости строки
	 * @param is_open открытость строки
	 * @param id - идентификатор строки
	 */
	const toggler = (is_open, id) => {
		let states = [...rowStates];
		let state = states.filter((c) => {
			return c.id === id;
		});
		state[0].is_open = is_open;
		setRowStates(states);
	};

	useEffect(() => {
		const dataFetch = async () => {
			// Получение данных
			const data = await // Заглушка - локальный JSON
			(await fetch("/data/main_courses.json")).json();

			// Инициализация состояний
			let states = []; // Состояние строк (развёрнуто/свёрнуто, ID строки)
			let disciplines = []; // Автозаполнение для фильтра дисциплин
			let coursesList = []; // Автозаполнение для фильтра курсов

			// Получение состояний
			data.forEach((el) => {
				states.push({ id: el.id, is_open: false });

				// Читаем доступные дисциплины
				disciplines.push(el.name);

				// Читаем доступные курсы
				coursesList.push(el.course);
			});

			// Только уникальные
			disciplines = [...new Set(disciplines)];
			coursesList = [...new Set(coursesList)];

			// Установка состояний
			setCourses(data);
			setDisciplines(disciplines);
			setCoursesList(coursesList);
			setRowStates(states);
		};

		dataFetch();
	}, []);

	/**
	 * Применение фильтров
	 * @param value - Фильтры, переданные хуком
	 */
	const handleApply = (value) => {
		console.table(value);
	};

	const editHandler = (index) => {
		setCourse2edit(courses[index]);
		setEditOpen(true);
	};

	const handleCourseSave = (course) => {
		console.info(course);
		setEditOpen(false);
	};

	const handleCourseClose = () => {
		setEditOpen(false);
	};

	return (
		<>
			<div className="courses-filters">
				<FilterCourses
					disciplines={disciplines}
					courses={coursesList}
					handleApply={handleApply}
					toggleCollapse={toggleCollapse}
					globalCollapse={globalCollapse}
				/>
				<div className="toggler-wrapper">
					<Button
						variant="outlined"
						sx={{ fontFamily: "Wix Madefor Text" }}
						onClick={toggleCollapse}
					>
						{globalCollapse ? (
							<span>Развернуть </span>
						) : (
							<span>Свернуть </span>
						)}{" "}
						<span
							style={{ marginLeft: "3px" }}
							className="hide-modal"
						>
							все дисциплины
						</span>
					</Button>
				</div>
			</div>
			<TableContainer>
				<Table
					className="simple-table screen"
					sx={{
						borderSpacing: 0,
						borderCollapse: "collapse",
					}}
					aria-label="simple table"
				>
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: "47%" }} colSpan={2}>
								Дисциплины
							</TableCell>
							<TableCell sx={{ width: "12%" }}>Курс</TableCell>
							<TableCell sx={{ width: "12%" }}>Лекции</TableCell>
							<TableCell sx={{ width: "12%" }}>
								Семинары
							</TableCell>
							<TableCell sx={{ width: "12%" }}>
								Лаб. занятия
							</TableCell>
							<TableCell
								sx={{
									width: "5%",
									textAlign: "right",
								}}
							>
								Действия
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{courses.map((row, index) => {
							return (
								<CollapsibleRow
									row={row}
									key={index}
									isOpen={rowStates[index].is_open}
									toggler={toggler}
									index={index}
									editHandler={editHandler}
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Table className="print simple-table">
				<TableHead>
					<TableRow>
						<TableCell>Дисциплины</TableCell>
						<TableCell>Курс</TableCell>
						<TableCell>Лекции</TableCell>
						<TableCell>Семинары</TableCell>
						<TableCell>Лаб. занятия</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{courses.map((row, index) => (
						<TableRow key={index}>
							<TableCell>{row.name}</TableCell>
							<TableCell>{row.course}</TableCell>
							<TableCell>
								{row.lections?.current || 0} /{" "}
								{row.lections?.total || 0}
							</TableCell>
							<TableCell>
								{row.seminars?.current || 0} /{" "}
								{row.seminars?.total || 0}
							</TableCell>
							<TableCell>
								{row.labs?.current} / {row.labs.total}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<EditModal
				open={editOpen}
				course={course2edit}
				handleClose={handleCourseClose}
				handleSave={handleCourseSave}
			/>
		</>
	);
}

export default CoursesTable;
