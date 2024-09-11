import {
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	ToggleButton,
	ToggleButtonGroup,
	ThemeProvider,
	IconButton,
	Card,
	CardContent,
	Button,
	MenuItem,
	Tooltip,
	Menu,
	Snackbar,
} from "@mui/material";
import {
	MoreVertRounded,
	CheckRounded,
	CancelRounded,
	PrintRounded,
	ClearRounded,
	SaveRounded,
	CloudUploadOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
} from "@mui/icons-material";
import {
	successTheme,
	warningTheme,
	criticalTheme,
	blackMarkTheme,
} from "../../../../components/toggleTheme";
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function StatementTable() {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [data, setData] = useState([]);
	const { type } = useParams(); // Тип ведомости, указанный в URL, сюда же по хорошему нужно передать ID ведомости

	const statementType = parseInt(type);

	const getJsonData = () => {
		fetch(`/data/statementGrades${type}.json`)
			.then((res) => res.json())
			.then((data) => setData(data.students));
	};

	useEffect(() => {
		fetch(`/data/statementGrades${type}.json`)
			.then((res) => res.json())
			.then((data) => setData(data.students));
	}, [type]);

	// Установка оценки
	const setValue = (e, newVal) => {
		if (!newVal) return;
		let newData = [...data];
		let studentId = parseInt(e.target.dataset["student"]);
		let student = newData[studentId];
		if (student) {
			student.gradeId = newVal;
		}
		setData(newData);
	};

	// Сохранение
	const save = () => {
		setSnackbarOpen(true);
		setSnackbarMessage("Данные успешно сохранены!");

		setTimeout(() => {
			setSnackbarOpen(false);
		}, 2000);
	};

	// Вызов контекстного меню
	const handleContext = (e) => {
		setAnchorEl(e.currentTarget);
	};

	// Закрытие контекстного меню
	const handleCloseContext = () => {
		setAnchorEl(null);
	};

	// Печать
	const print = () => {
		window.print();
	};

	// Сброс
	const reset = () => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;
		getJsonData(url);
	};

	// Заголовок колонки таблицы с допуском
	const accessHeader = () => {
		if (statementType === 0) {
			return <TableCell sx={{ width: "100%" }}>Допуск</TableCell>;
		}
		return <></>;
	};

	/**
	 * Ячейка таблицы со значением допуска
	 * @param {*} student - студент
	 * @returns контрол со значением допуска
	 */
	const accessVal = (student) => {
		if (statementType === 0) {
			let control = <></>;

			if (student.gradeId !== 6) {
				control = (
					<>
						<CheckRounded
							className="screen"
							sx={{ color: "#939393" }}
						/>
						<span className="print">да</span>
					</>
				);
			} else {
				control = (
					<>
						<div className="screen">
							<div
								style={{
									display: "flex",
									alignItems: "center",
									color: "red",
								}}
							>
								<CancelRounded sx={{ marginRight: "10px" }} />{" "}
								Нет допуска
							</div>
						</div>
						<div className="print">Нет допуска</div>
					</>
				);
			}

			return <TableCell>{control}</TableCell>;
		}

		return <></>;
	};

	const getPrintValue = (value) => {
		switch (true) {
			// Неявка
			case value === 1:
				return "–";
			// Незачёт
			case statementType !== 0 &&
				statementType !== 2 &&
				statementType !== 3 &&
				statementType !== 4 &&
				value === 2:
				return "Незачёт";
			case value === 6:
				return "–";
			case value === 7:
				return "Неявка";
			case statementType !== 0 &&
				statementType !== 2 &&
				statementType !== 3 &&
				statementType !== 4 &&
				value === 5:
				return "Зачёт";
			default:
				return value;
		}
	};

	/**
	 * Контрол оценки
	 * @param {*} value - оценка
	 * @param {*} index - индекс студента
	 * @returns Контрол с оценкой
	 */
	const getValue = (value, index) => {
		const disabledStyle =
			value === 6 ? { pointerEvents: "none", opacity: "0.3" } : {};
		if (
			statementType === 0 ||
			statementType === 2 ||
			statementType === 3 ||
			statementType === 4
		) {
			return (
				<>
					<ToggleButtonGroup
						sx={disabledStyle}
						className="screen"
						exclusive
						value={value}
						onChange={setValue}
					>
						<ThemeProvider theme={successTheme}>
							<ToggleButton data-student={index} value={5}>
								5
							</ToggleButton>
						</ThemeProvider>
						<ThemeProvider theme={successTheme}>
							<ToggleButton data-student={index} value={4}>
								4
							</ToggleButton>
						</ThemeProvider>
						<ThemeProvider theme={warningTheme}>
							<ToggleButton data-student={index} value={3}>
								3
							</ToggleButton>
						</ThemeProvider>
						<ThemeProvider theme={criticalTheme}>
							<ToggleButton data-student={index} value={2}>
								Неуд
							</ToggleButton>
						</ThemeProvider>
						<ThemeProvider theme={blackMarkTheme}>
							<ToggleButton data-student={index} value={7}>
								Неявка
							</ToggleButton>
						</ThemeProvider>
					</ToggleButtonGroup>
					<span className="print">
						<span className="print">{getPrintValue(value)}</span>
					</span>
				</>
			);
		}
		return (
			<>
				<ToggleButtonGroup
					exclusive
					onChange={setValue}
					className="screen"
					value={value}
					sx={disabledStyle}
				>
					<ThemeProvider theme={successTheme}>
						<ToggleButton
							size="small"
							data-student={index}
							value={5}
						>
							Зачёт
						</ToggleButton>
					</ThemeProvider>
					<ThemeProvider theme={criticalTheme}>
						<ToggleButton
							size="small"
							data-student={index}
							value={2}
						>
							Незачёт
						</ToggleButton>
					</ThemeProvider>
					<ThemeProvider theme={blackMarkTheme}>
						<ToggleButton
							size="small"
							data-student={index}
							value={7}
						>
							Неявка
						</ToggleButton>
					</ThemeProvider>
				</ToggleButtonGroup>
				<span className="print">{getPrintValue(value)}</span>
			</>
		);
	};

	const menuItems = () => {
		if (statementType === 3 || statementType === 4) {
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

	return (
		<>
			<Card>
				<CardContent>
					<TableContainer>
						<Table className="simple-table">
							<TableHead>
								<TableRow>
									<TableCell>№</TableCell>
									<TableCell sx={{ width: "50%" }}>
										ФИО
									</TableCell>
									<TableCell sx={{ width: "20%" }}>
										Посещаемость
									</TableCell>
									{accessHeader()}
									<TableCell sx={{ width: "20%" }}>
										Оценка
									</TableCell>
									<TableCell
										className="screen"
										sx={{ textAlign: "right" }}
									>
										Действия
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((student, index) => (
									<TableRow key={index}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											{student.lastName}{" "}
											{student.firstName}{" "}
											{student.middleName}
										</TableCell>
										<TableCell>
											{student.attendancePercentage}%
										</TableCell>
										{accessVal(student)}
										<TableCell>
											{getValue(student.gradeId, index)}
										</TableCell>
										<TableCell
											className="screen"
											sx={{
												textAlign: "right",
											}}
										>
											<IconButton
												aria-controls={
													open
														? "student-menu"
														: undefined
												}
												aria-haspopup={true}
												aria-expanded={
													open ? "true" : undefined
												}
												onClick={handleContext}
											>
												<MoreVertRounded />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
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

export default StatementTable;
