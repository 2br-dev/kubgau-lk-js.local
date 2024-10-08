import {
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@mui/material";
import FilterCourses from "../filter_courses";
import React, { Fragment } from "react";
import EditModal from "../editModal";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import DesktopTable from "./components/desktopTable";
import MobileTable from "./components/mobileTable";

function CoursesTable() {
	const [courses, setCourses] = useState([]);
	const [rowStates, setRowStates] = useState([]);
	const [disciplines, setDisciplines] = useState([]);
	const [coursesList, setCoursesList] = useState([]);
	const [globalCollapse, setGlobalCollapse] = useState(true);
	const [editOpen, setEditOpen] = useState(false);
	const [course2edit, setCourse2edit] = useState(null);
	const navigate = useNavigate();

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

	const editHandler = (e) => {
		let index = parseInt(e.currentTarget.dataset.id);
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

	const handleGroupClick = () => {
		navigate("/main/groups");
	};

	const handleSubgroupClick = () => {
		navigate("/main/subgroups");
	};

	const handleJournalClick = () => {
		navigate("/main/journal");
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
			</div>
			<DesktopTable
				courses={courses}
				handleGroupClick={handleGroupClick}
				handleSubgroupClick={handleSubgroupClick}
				handleJournalClick={handleJournalClick}
				editHandler={editHandler}
			/>
			<MobileTable
				courses={courses}
				handleGroupClick={handleGroupClick}
				handleSubgroupClick={handleSubgroupClick}
				handleJournalClick={handleJournalClick}
				editHandler={editHandler}
			/>
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
