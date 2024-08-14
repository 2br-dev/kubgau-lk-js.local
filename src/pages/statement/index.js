import {
	Button,
	Card,
	CardContent,
	IconButton,
	Menu,
	Tooltip,
	MenuItem,
	Snackbar,
} from "@mui/material";
import PageHeader from "../../components/pageHeader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	CloudUploadOutlined,
	PrintRounded,
	SaveRounded,
	ClearRounded,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
} from "@mui/icons-material";
import "./index.scss";
import StatementData from "./components/statement-data/";
import StatementTable from "./components/statement-table";
import React from "react";

/**
 * Страница ведомости
 */
function Statement() {
	// Инициализация
	const { type } = useParams(); // Тип ведомости, указанный в URL, сюда же по хорошему нужно передать ID ведомости

	const [data, setData] = useState({
		group: null,
		number: null,
		type: null,
		subtype: null,
		state: null,
		access: null,
		unit: null,
		hours: null,
		doc: null,
		startDate: null,
		closeDate: null,
		deadline: null,
		examDate: null,
		students: [],
	});

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const menuItems = () => {
		if (type === "course") {
			return [
				<MenuItem disableRipple key={0}>
					<span className="context-item">
						<span className="context-title">Рецензия</span>
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
							{/* Показываем кнопку удалить, когда есть что удалять */}
							{/* <Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip> */}
						</span>
					</span>
				</MenuItem>,
				<MenuItem disableRipple key={1}>
					<span className="context-item">
						<span className="context-title">Работа</span>
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
			];
		} else {
			return [
				<MenuItem disableRipple key={1}>
					<span className="context-item">
						<span className="context-title">
							Аттестационный лист
						</span>
						{/* Если уже загружен, кнопки как у остальных */}
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
				<MenuItem disableRipple key={2}>
					<span className="context-item">
						<span className="context-title">Отчёт</span>
						<span className="context-actions">
							<Tooltip title="Редактировать" placement="top">
								<IconButton>
									<EditOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Скачать" placement="top">
								<IconButton>
									<DownloadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
				<MenuItem key={3} disableRipple>
					<span className="context-item">
						<span className="context-title">Документы</span>
						<span className="context-actions">
							<Tooltip title="Редактировать" placement="top">
								<IconButton>
									<EditOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Скачать" placement="top">
								<IconButton>
									<DownloadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
			];
		}
	};

	// Получение данных из JSON
	const getJsonData = (url) => {
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// Получение начальных данных
	useEffect(() => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;
		getJsonData(url);
	}, [type]);

	// Установка оценки
	const setValue = (e, newVal) => {
		if (!newVal) return;
		let newData = { ...data };
		let studentId = parseInt(e.target.dataset["student"]);
		let student = newData.students[studentId];
		if (student) {
			student.value = newVal;
		}
		setData(newData);
	};

	// Вызов контекстного меню
	const handleContext = (e) => {
		setAnchorEl(e.currentTarget);
	};

	// Закрытие контекстного меню
	const handleCloseContext = () => {
		setAnchorEl(null);
	};

	// Сохранение
	const save = () => {
		setSnackbarOpen(true);
		setSnackbarMessage("Данные успешно сохранены!");

		setTimeout(() => {
			setSnackbarOpen(false);
		}, 2000);
	};

	// Сброс
	const reset = () => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;
		getJsonData(url);
	};

	// Печать
	const print = () => {
		window.print();
	};

	// DOM
	return (
		<>
			<main id="statement">
				<section>
					<div className="container">
						<PageHeader
							header="Программирование"
							backLink={true}
							subheader="Редактирование ведомости"
						/>
					</div>
					<div className="container" style={{ marginBottom: "40px" }}>
						<StatementData data={data} />
					</div>
					<div className="container">
						<Card>
							<CardContent>
								<StatementTable
									data={data}
									open={open}
									setValue={setValue}
									handleContext={handleContext}
								/>
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
						<div className="card-actions-wrapper mobile">
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
			<Menu
				id="student-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseContext}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
			>
				{menuItems()}
			</Menu>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={snackbarOpen}
				message={snackbarMessage}
			/>
		</>
	);
}

export default Statement;
